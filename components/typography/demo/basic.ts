import { Component } from '@angular/core';

import { TriDividerModule } from 'ng-zorro-antd/divider';
import { TriTypographyModule } from 'ng-zorro-antd/typography';

@Component({
  selector: 'tri-demo-typography-basic',
  imports: [TriDividerModule, TriTypographyModule],
  template: `
    <article tri-typography>
      <h1 tri-typography>Introduction</h1>
      <p tri-typography>
        In the process of internal desktop applications development, many different design specs and implementations
        would be involved, which might cause designers and developers difficulties and duplication and reduce the
        efficiency of development.
      </p>
      <p tri-typography>
        After massive project practice and summaries, Ant Design, a design language for backgroundapplications, is
        refined by Ant UED Team, which aims to
        <span tri-typography>
          <strong>
            uniform the user interface specs for internal background projects, lower the unnecessary cost of design
            differences and implementation and liberate the resources ofdesign and front-end development
          </strong>
        </span>
        .
      </p>
      <h2 tri-typography>Guidelines and Resources</h2>
      <p tri-typography>
        We supply a series of design principles, practical patterns and high quality design resources (
        <span tri-typography><code>Sketch</code></span>
        and
        <span tri-typography><code>Axure</code></span>
        ), to help people create their product prototypes beautifully and efficiently.
      </p>
      <div tri-typography>
        <ul>
          <li>
            <a href="/docs/spec/proximity">Principles</a>
          </li>
          <li>
            <a href="/docs/pattern/navigation">Patterns</a>
          </li>
          <li>
            <a href="/docs/resource/download">Resource Download</a>
          </li>
        </ul>
      </div>
      <p tri-typography>
        Press
        <span tri-typography><kbd>Esc</kbd></span>
        to exist...
      </p>
    </article>
    <tri-divider></tri-divider>
    <article tri-typography>
      <h1 tri-typography>介绍</h1>
      <p tri-typography>
        蚂蚁的企业级产品是一个庞大且复杂的体系。这类产品不仅量级巨大且功能复杂，而且变动和并发频繁，常常需要设计与开发能够快速的做出响应。
        同时这类产品中有存在很多类似的页面以及组件，可以通过抽象得到一些稳定且高复用性的内容。
      </p>
      <p tri-typography>
        随着商业化的趋势，越来越多的企业级产品对更好的用户体验有了进一步的要求。带着这样的一个终极目标，我们（蚂蚁金服体验技术部）
        经过大量的项目实践和总结，逐步打磨出一个服务于企业级产品的设计体系 Ant Design。 基于
        <span tri-typography><mark>『确定』和『自然』</mark></span>
        的设计价值观，通过模块化的解决方案，降低冗余的生产成本， 让设计者专注于
        <span tri-typography><strong>更好的用户体验</strong></span>
        。
      </p>
      <h2 tri-typography>设计资源</h2>
      <p tri-typography>
        我们提供完善的设计原则、最佳实践和设计资源文件 （
        <span tri-typography><code>Sketch</code></span>
        和
        <span tri-typography><code>Axure</code></span>
        ），来帮助业务快速设计出高质 量的产品原型。
      </p>
      <div tri-typography>
        <ul>
          <li>
            <a href="/docs/spec/proximity">设计原则</a>
          </li>
          <li>
            <a href="/docs/pattern/navigation">设计模式</a>
          </li>
          <li>
            <a href="/docs/resource/download">设计资源</a>
          </li>
        </ul>
      </div>
      <p tri-typography>
        按
        <span tri-typography><kbd>Esc</kbd></span>
        键退出阅读……
      </p>
    </article>
  `
})
export class TriDemoTypographyBasicComponent {}
