import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { ApiGateWayService } from './app/services/apiGateway.service';

bootstrapApplication(AppComponent, appConfig)
  .then(appRef => {
    const apiGatewayService = appRef.injector.get(ApiGateWayService);
    apiGatewayService.checkTokenStatus().subscribe();
  })
  .catch((err) => console.error(err));
