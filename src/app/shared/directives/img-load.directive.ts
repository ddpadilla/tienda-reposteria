import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: 'img[loading="lazy"]',
  standalone: true
})
export class ImgLoadDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {
    // If image is already cached/loaded
    if (this.el.nativeElement.complete) {
      this.onLoad();
    }
  }

  @HostListener('load')
  onLoad() {
    this.renderer.addClass(this.el.nativeElement, 'loaded');
  }

  @HostListener('error')
  onError() {
    this.renderer.addClass(this.el.nativeElement, 'error');
  }
}
