import {Component, inject} from '@angular/core';
import { LANGUAGES } from '../../shared/langauge/language.constants';
import { TranslateService } from '@ngx-translate/core';
import FindLanguageFromKeyPipe from '../../shared/langauge/find-language-from-key.pipe';
import { StateStorageService } from '../../core/config/state-storage.service';
import {TranslateDirective} from '../../shared/langauge/translate.directive';
import ActiveMenuDirective from '../../shared/langauge/active-menu.directive';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    FindLanguageFromKeyPipe,
    TranslateDirective,
    ActiveMenuDirective
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  languages = LANGUAGES;
  private translateService = inject(TranslateService);
  private stateStorageService = inject(StateStorageService);
  changeLanguage(languageKey: string): void {
    this.stateStorageService.storeLocale(languageKey);
    this.translateService.use(languageKey);
  }

}
