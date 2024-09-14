import {Directive, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {TranslateService} from "@ngx-translate/core";
import {translationNotFoundMessage} from './translation.config';

@Directive({
  selector: '[appTranslate]',
  standalone: true
})
export class TranslateDirective  implements  OnChanges, OnInit, OnDestroy {
  @Input() appTranslate!: string;
  @Input() translateValues?: { [key: string]: unknown };

  private readonly directiveDestroyed = new Subject();

  constructor(private el: ElementRef, private translateService: TranslateService) {}

  ngOnChanges(): void {
    this.getTranslation();
  }

  ngOnDestroy(): void {
    this.directiveDestroyed.next(null);
    this.directiveDestroyed.complete();
  }

  ngOnInit(): void {
    this.translateService.onLangChange.pipe(takeUntil(this.directiveDestroyed)).subscribe(() => this.getTranslation());
    this.translateService.onTranslationChange.pipe(takeUntil(this.directiveDestroyed)).subscribe(() => this.getTranslation());
  }

  private getTranslation(): void {
    this.translateService
      .get(this.appTranslate, this.translateValues)
      .pipe(takeUntil(this.directiveDestroyed))
      .subscribe({
        next: value => {
          this.el.nativeElement.innerHTML = value;
        },
        error: err => `${translationNotFoundMessage}[${this.appTranslate}]`,
      });
  }
}
