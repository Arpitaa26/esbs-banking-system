import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ApiGateWayService } from '../services/apiGateway.service';
import { ToastrService } from '../services/toastr.service';

export const authGuard: CanActivateFn = (route, state) => {
    const apiGate = inject(ApiGateWayService);
    const router = inject(Router);
    const toastr = inject(ToastrService);

    const authToken = apiGate.getAuthToken();

    if(authToken) {
      return true;
    } else {
      return router.createUrlTree(['/']);
    }
};
