import {Component, inject} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MainComponent} from './layouts/main/main.component';
import {ApplicationConfigService} from './core/config/application-config.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MainComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private applicationConfigService = inject(ApplicationConfigService);
  title = 'client-ms';

  constructor() {
    this.applicationConfigService.setEndpointPrefix(SERVER_API_URL);
  }
}
