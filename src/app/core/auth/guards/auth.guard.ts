import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'app/core/auth/auth.service';
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';
import { isEqualWith } from 'lodash';
import { PagesService } from 'app/pages/pages.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard extends KeycloakAuthGuard implements CanActivateChild, CanActivate {
  /**
   * Constructor
   */
  constructor(
    private _authService: AuthService,
    protected readonly router: Router,
    protected readonly keycloak: KeycloakService
  ) {
    super(router, keycloak);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------



  canActivateChild(childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const currenteUser = this._authService.getRole();

    if (currenteUser) {
      // check if route is restricted by role
      if (childRoute.data?.roles && childRoute.data?.roles?.indexOf(String(currenteUser)) === -1) {

        // role not authorised so redirect to home page
        this.router.navigate(['401-unauthorized']);
        return false;
      }

      // authorised so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    this._authService.signOut();
    return false;
  }

  public async isAccessAllowed(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    // Force the user to log in if currently unauthenticated.
    if (!this.authenticated) {
      await this.keycloak.login({
        redirectUri: window.location.origin + state.url,
      });
    }

    // Get the roles required from the route.
    const requiredRoles = route.data.roles;

    // Allow the user to to proceed if no additional roles are required to access the route.
    if (!(requiredRoles instanceof Array) || requiredRoles.length === 0) {
      return true;
    }

    //Check token
    this._check();

    // Allow the user to proceed if all the required roles are present.
    return requiredRoles.every(role => this.roles.includes(role));

  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Check the authenticated status
   *
   * @private
   */
  private _check(): Promise<boolean> {
    // Check the authentication status
    return this._authService.check();
  }
}
