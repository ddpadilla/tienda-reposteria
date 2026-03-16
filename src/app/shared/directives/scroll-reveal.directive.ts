import { Directive, ElementRef, Input, OnInit, Renderer2, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appScrollReveal]',
  standalone: true
})
export class ScrollRevealDirective implements OnInit, OnDestroy {
  @Input() animation: 'fade' | 'slide-up' | 'slide-left' | 'slide-right' = 'slide-up';
  @Input() delay = 0;
  @Input() threshold = 0.1;

  private observer!: IntersectionObserver;
  private hasAnimated = false;

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.renderer.addClass(this.el.nativeElement, 'scroll-reveal');
    this.renderer.addClass(this.el.nativeElement, `scroll-reveal-${this.animation}`);
  }

  ngOnInit() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.hasAnimated) {
            this.hasAnimated = true;
            setTimeout(() => {
              this.renderer.addClass(this.el.nativeElement, 'revealed');
            }, this.delay);
          }
        });
      },
      { threshold: this.threshold }
    );

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
