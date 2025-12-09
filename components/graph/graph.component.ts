/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgTemplateOutlet, isPlatformBrowser } from '@angular/common';
import {
  AfterContentChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  DestroyRef,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  PLATFORM_ID,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewChildren,
  ViewEncapsulation,
  booleanAttribute,
  forwardRef,
  inject
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, ReplaySubject, Subscription, forkJoin } from 'rxjs';
import { finalize, take } from 'rxjs/operators';

import { buildGraph } from 'dagre-compound';

import { TriNoAnimationDirective } from 'ng-zorro-antd/core/animation';
import { cancelAnimationFrame, requestAnimationFrame } from 'ng-zorro-antd/core/polyfill';
import { TriSafeAny } from 'ng-zorro-antd/core/types';

import { calculateTransform } from './core/utils';
import { TriGraphData } from './data-source/graph-data-source';
import { TriGraph } from './graph';
import { TriGraphDefsComponent } from './graph-defs.component';
import { TriGraphEdgeComponent } from './graph-edge.component';
import { TriGraphEdgeDirective } from './graph-edge.directive';
import { TriGraphGroupNodeDirective } from './graph-group-node.directive';
import { TriGraphNodeComponent } from './graph-node.component';
import { TriGraphNodeDirective } from './graph-node.directive';
import { TriGraphZoomDirective } from './graph-zoom.directive';
import {
  TRI_GRAPH_LAYOUT_SETTING,
  TriGraphDataDef,
  TriGraphEdge,
  TriGraphEdgeDef,
  TriGraphGroupNode,
  TriGraphLayoutConfig,
  TriGraphNode,
  TriGraphNodeDef,
  TriGraphOption,
  TriLayoutSetting,
  TriRankDirection,
  nzTypeDefinition
} from './interface';

/** Checks whether an object is a data source. */
export function isDataSource(value: TriSafeAny): value is TriGraphData {
  // Check if the value is a DataSource by observing if it has a connect function. Cannot
  // be checked as an `instanceof DataSource` since people could create their own sources
  // that match the interface, but don't extend DataSource.
  return value && typeof value.connect === 'function';
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'tri-graph',
  exportAs: 'triGraph',
  providers: [{ provide: TriGraph, useExisting: forwardRef(() => TriGraphComponent) }],
  template: `
    <ng-content></ng-content>
    <svg width="100%" height="100%">
      <svg:defs tri-graph-defs></svg:defs>
      <svg:g [attr.transform]="transformStyle">
        <ng-container
          [ngTemplateOutlet]="groupTemplate"
          [ngTemplateOutletContext]="{ renderNode: renderInfo, type: 'root' }"
        ></ng-container>
      </svg:g>
    </svg>

    <ng-template #groupTemplate let-renderNode="renderNode" let-type="type">
      <svg:g [attr.transform]="type === 'sub' ? subGraphTransform(renderNode) : null">
        <svg:g class="core" [attr.transform]="coreTransform(renderNode)">
          <svg:g class="nz-graph-edges">
            @for (edge of $asNzGraphEdges(renderNode.edges); track edgeTrackByFun(edge)) {
              <g
                class="nz-graph-edge"
                tri-graph-edge
                [edge]="edge"
                [edgeType]="graphLayoutConfig?.defaultEdge?.type"
                [customTemplate]="customGraphEdgeTemplate"
              ></g>
            }
          </svg:g>

          <svg:g class="nz-graph-nodes">
            @for (node of typedNodes(renderNode.nodes); track node.name) {
              @if (node.type === 1) {
                <g class="nz-graph-node" tri-graph-node [node]="node" [customTemplate]="nodeTemplate"></g>
              }

              @if (node.type === 0) {
                <g class="nz-graph-node" tri-graph-node [node]="node" [customTemplate]="groupNodeTemplate"></g>
              }

              @if (node.expanded) {
                <ng-container
                  [ngTemplateOutlet]="groupTemplate"
                  [ngTemplateOutletContext]="{ renderNode: node, type: 'sub' }"
                />
              }
            }
          </svg:g>
        </svg:g>
      </svg:g>
    </ng-template>
  `,
  host: {
    '[class.nz-graph]': 'true',
    '[class.nz-graph-auto-size]': 'nzAutoSize'
  },
  imports: [NgTemplateOutlet, TriGraphEdgeComponent, TriGraphNodeComponent, TriGraphDefsComponent]
})
export class TriGraphComponent implements OnInit, OnChanges, AfterContentChecked, TriGraph {
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private elementRef: ElementRef = inject(ElementRef);
  private platformId = inject(PLATFORM_ID);
  private destroyRef = inject(DestroyRef);

  @ViewChildren(TriGraphNodeComponent, { read: ElementRef }) listOfNodeElement!: QueryList<ElementRef>;
  @ViewChildren(TriGraphNodeComponent) listOfNodeComponent!: QueryList<TriGraphNodeComponent>;

  @ContentChild(TriGraphNodeDirective, { static: true, read: TemplateRef }) nodeTemplate?: TemplateRef<{
    $implicit: TriGraphNode;
  }>;
  @ContentChild(TriGraphGroupNodeDirective, { static: true, read: TemplateRef }) groupNodeTemplate?: TemplateRef<{
    $implicit: TriGraphGroupNode;
  }>;
  @ContentChild(TriGraphEdgeDirective, { static: true, read: TemplateRef }) customGraphEdgeTemplate?: TemplateRef<{
    $implicit: TriGraphEdge;
  }>;
  /**
   * Provides a stream containing the latest data array to render.
   * Data source can be an observable of NzGraphData, or a NzGraphData to render.
   */
  @Input() graphData!: TriGraphData;
  @Input() rankDirection: TriRankDirection = 'LR';
  @Input() graphLayoutConfig?: TriGraphLayoutConfig;
  @Input({ transform: booleanAttribute }) autoSize = false;

  @Output() readonly graphInitialized = new EventEmitter<TriGraphComponent>();
  @Output() readonly graphRendered = new EventEmitter<TriGraphComponent>();
  @Output() readonly nodeClick = new EventEmitter<TriGraphNode | TriGraphGroupNode>();

  requestId: number = -1;
  transformStyle = '';
  graphRenderedSubject$ = new ReplaySubject<void>(1);
  renderInfo: TriGraphGroupNode = { labelHeight: 0 } as TriGraphGroupNode;
  mapOfNodeAttr: Record<string, TriGraphNodeDef> = {};
  mapOfEdgeAttr: Record<string, TriGraphEdgeDef> = {};
  zoom = 1;

  public readonly typedNodes = nzTypeDefinition<Array<TriGraphNode | TriGraphGroupNode>>();
  private dataSource?: TriGraphData;
  private layoutSetting: TriLayoutSetting = TRI_GRAPH_LAYOUT_SETTING;
  /** Data subscription */
  private _dataSubscription?: Subscription | null;

  edgeTrackByFun = (edge: TriGraphEdge): string => `${edge.v}-${edge.w}`;

  subGraphTransform = (node: TriGraphGroupNode): string => {
    const x = node.x - node.coreBox.width / 2.0;
    const y = node.y - node.height / 2.0 + node.paddingTop;
    return `translate(${x}, ${y})`;
  };

  $asNzGraphEdges = (data: unknown): TriGraphEdge[] => data as TriGraphEdge[];

  coreTransform = (node: TriGraphGroupNode): string => `translate(0, ${node.parentNodeName ? node.labelHeight : 0})`;

  noAnimation = inject(TriNoAnimationDirective, { host: true, optional: true });
  graphZoom = inject(TriGraphZoomDirective, { optional: true });

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.dataSource && typeof this.dataSource.disconnect === 'function') {
        this.dataSource.disconnect();
      }

      if (this._dataSubscription) {
        this._dataSubscription.unsubscribe();
        this._dataSubscription = null;
      }
      cancelAnimationFrame(this.requestId);
    });
  }

  ngOnInit(): void {
    this.graphRenderedSubject$.pipe(take(1), takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      // Only zooming is not set, move graph to center
      if (!this.graphZoom) {
        this.fitCenter();
      }
      this.graphInitialized.emit(this);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { nzAutoFit, nzRankDirection, nzGraphData, nzGraphLayoutConfig } = changes;
    if (nzGraphLayoutConfig) {
      this.layoutSetting = this.mergeConfig(nzGraphLayoutConfig.currentValue);
    }

    if (nzGraphData) {
      if (this.dataSource !== this.graphData) {
        this._switchDataSource(this.graphData);
      }
    }

    if ((nzAutoFit && !nzAutoFit.firstChange) || (nzRankDirection && !nzRankDirection.firstChange)) {
      // Render graph
      if (this.dataSource!.dataSource) {
        this.drawGraph(this.dataSource!.dataSource, {
          rankDirection: this.rankDirection,
          expanded: this.dataSource!.expansionModel.selected || []
        }).then(() => {
          this.cdr.markForCheck();
        });
      }
    }

    this.cdr.markForCheck();
  }

  ngAfterContentChecked(): void {
    if (this.dataSource && !this._dataSubscription) {
      this.observeRenderChanges();
    }
  }

  /**
   * Move graph to center and scale automatically
   */
  fitCenter(): void {
    const { x, y, k } = calculateTransform(
      this.elementRef.nativeElement.querySelector('svg'),
      this.elementRef.nativeElement.querySelector('svg > g')
    )!;
    if (k) {
      this.zoom = k;
      this.transformStyle = `translate(${x}, ${y})scale(${k})`;
    }
    this.cdr.markForCheck();
  }

  /**
   * re-Draw graph
   *
   * @param data
   * @param options
   * @param needResize
   */
  drawGraph(data: TriGraphDataDef, options: TriGraphOption, needResize: boolean = false): Promise<void> {
    return new Promise(resolve => {
      if (!isPlatformBrowser(this.platformId)) {
        return resolve();
      }
      this.requestId = requestAnimationFrame(() => {
        const renderInfo = this.buildGraphInfo(data, options);
        // TODO
        // Need better performance
        this.renderInfo = renderInfo;
        this.cdr.markForCheck();
        this.requestId = requestAnimationFrame(() => {
          this.drawNodes(!this.noAnimation?.noAnimation?.()).then(() => {
            // Update element
            this.cdr.markForCheck();
            if (needResize) {
              this.resizeNodeSize().then(() => {
                const dataSource: TriGraphDataDef = this.dataSource!.dataSource!;
                this.drawGraph(dataSource, options, false).then(() => resolve());
              });
            } else {
              this.graphRenderedSubject$.next();
              this.graphRendered.emit(this);
              resolve();
            }
          });
        });
      });
      this.cdr.markForCheck();
    });
  }

  /**
   * Redraw all nodes
   *
   * @param animate
   */
  drawNodes(animate: boolean = true): Promise<void> {
    return new Promise(resolve => {
      if (animate) {
        this.makeNodesAnimation().subscribe(() => {
          resolve();
        });
      } else {
        this.listOfNodeComponent.map(node => {
          node.makeNoAnimation();
        });
        resolve();
      }
    });
  }

  private resizeNodeSize(): Promise<void> {
    return new Promise(resolve => {
      const dataSource: TriGraphDataDef = this.dataSource!.dataSource!;
      let scale = this.graphZoom?.zoom || this.zoom || 1;
      this.listOfNodeElement.forEach(nodeEle => {
        const contentEle = nodeEle.nativeElement;
        if (contentEle) {
          let width: number;
          let height: number;
          // Check if foreignObject is set
          const clientRect = contentEle.querySelector('foreignObject > :first-child')?.getBoundingClientRect();
          if (clientRect) {
            width = clientRect.width;
            height = clientRect.height;
          } else {
            const bBoxRect = contentEle.getBBox();
            width = bBoxRect.width;
            height = bBoxRect.height;
            // getBBox will return actual value
            scale = 1;
          }
          // Element id type is string
          const node = dataSource.nodes.find(n => `${n.id}` === nodeEle.nativeElement.id);
          if (node && width && height) {
            node.height = height / scale;
            node.width = width / scale;
          }
        }
      });
      resolve();
    });
  }

  /**
   * Switch to the provided data source by resetting the data and unsubscribing from the current
   * render change subscription if one exists. If the data source is null, interpret this by
   * clearing the node outlet. Otherwise start listening for new data.
   */
  private _switchDataSource(dataSource: TriGraphData): void {
    if (this.dataSource && typeof this.dataSource.disconnect === 'function') {
      this.graphData.disconnect();
    }

    if (this._dataSubscription) {
      this._dataSubscription.unsubscribe();
      this._dataSubscription = null;
    }

    this.dataSource = dataSource;
    this.observeRenderChanges();
  }

  /** Set up a subscription for the data provided by the data source. */
  private observeRenderChanges(): void {
    let dataStream: Observable<TriGraphDataDef> | undefined;
    let graphOptions: TriGraphOption = {
      rankDirection: this.rankDirection
    };
    if (isDataSource(this.dataSource)) {
      dataStream = this.dataSource.connect();
    }

    if (dataStream) {
      this._dataSubscription = dataStream.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(data => {
        graphOptions = {
          rankDirection: this.rankDirection,
          expanded: this.graphData.expansionModel.selected
        };
        this.drawGraph(data, graphOptions, this.autoSize).then(() => {
          this.cdr.detectChanges();
        });
      });
    } else {
      throw Error(`A valid data source must be provided.`);
    }
  }

  /**
   * Get renderInfo and prepare some data
   *
   * @param data
   * @param options
   * @private
   */
  private buildGraphInfo(data: TriGraphDataDef, options: TriGraphOption): TriGraphGroupNode {
    this.parseInfo(data);
    const renderInfo = buildGraph(data, options, this.layoutSetting) as TriGraphGroupNode;
    const dig = (nodes: Array<TriGraphNode | TriGraphGroupNode>): void => {
      nodes.forEach(node => {
        const { x, y } = node;
        node.xOffset = x;
        node.yOffset = y;
        if (node.type === 1 && this.mapOfNodeAttr.hasOwnProperty(node.name)) {
          Object.assign(node, this.mapOfNodeAttr[node.name]);
        } else if (node.type === 0) {
          (node as TriGraphGroupNode).edges.forEach(edge => {
            if (this.mapOfEdgeAttr.hasOwnProperty(`${edge.v}-${edge.w}`)) {
              Object.assign(edge, this.mapOfEdgeAttr[`${edge.v}-${edge.w}`]);
            }
          });
          dig(node.nodes);
        }
      });
    };
    dig(renderInfo.nodes);
    // Assign data to edges of root graph
    renderInfo.edges.forEach(edge => {
      if (this.mapOfEdgeAttr.hasOwnProperty(`${edge.v}-${edge.w}`)) {
        Object.assign(edge, this.mapOfEdgeAttr[`${edge.v}-${edge.w}`]);
      }
    });
    return renderInfo;
  }

  /**
   * Play with animation
   *
   * @private
   */
  private makeNodesAnimation(): Observable<void[]> {
    return forkJoin(this.listOfNodeComponent.map(node => node.makeAnimation())).pipe(
      finalize(() => {
        this.cdr.detectChanges();
      })
    );
  }

  private parseInfo(data: TriGraphDataDef): void {
    data.nodes.forEach(n => {
      this.mapOfNodeAttr[n.id] = n;
    });
    data.edges.forEach(e => {
      this.mapOfEdgeAttr[`${e.v}-${e.w}`] = e;
    });
  }

  /**
   * Merge config with user inputs
   *
   * @param config
   * @private
   */
  private mergeConfig(config: TriGraphLayoutConfig): TriLayoutSetting {
    const graphMeta = config?.layout || {};
    const subSceneMeta = config?.subScene || {};
    const defaultNodeMeta = config?.defaultNode || {};
    const defaultCompoundNodeMeta = config?.defaultCompoundNode || {};
    const bridge = TRI_GRAPH_LAYOUT_SETTING.nodeSize.bridge;

    const graph: TriLayoutSetting['graph'] = { meta: { ...TRI_GRAPH_LAYOUT_SETTING.graph.meta, ...graphMeta } };
    const subScene: TriLayoutSetting['subScene'] = {
      meta: { ...TRI_GRAPH_LAYOUT_SETTING.subScene.meta, ...subSceneMeta }
    };
    const nodeSize: TriLayoutSetting['nodeSize'] = {
      meta: { ...TRI_GRAPH_LAYOUT_SETTING.nodeSize.meta, ...defaultCompoundNodeMeta },
      node: { ...TRI_GRAPH_LAYOUT_SETTING.nodeSize.node, ...defaultNodeMeta },
      bridge
    };

    return { graph, subScene, nodeSize };
  }
}
