import { Injectable } from '@angular/core';
import { ROLE_ADMIN } from 'app/utils/roles.adm';
import { KeycloakService } from 'keycloak-angular';

@Injectable()
export class AuthService {
    private _authenticated: boolean = false;

    /**
     * Constructor
     */
    constructor(private keyclockService: KeycloakService) { }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: any) {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken') ? localStorage.getItem('accessToken') : null;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------


    /**
     * Sign out
     */
    signOut(): Promise<any> {
        localStorage.removeItem('accessToken');
        // Set the authenticated flag to false
        this._authenticated = false;

        //Logout with KeyClock
        return this.keyclockService.logout(window.location.origin + '/inicio');
    }


    /**
     * Check the authentication status
     */
    async check(): Promise<boolean> {
        this.accessToken = await this.keyclockService.getToken();
        // Check if the user is logged in
        if (this.accessToken) {
            return this._authenticated = true;

        }
        this.signOut();
        return this._authenticated = false;

    }

    /**
     * Get the user KeyClock Profile
     */

    async getUser(): Promise<any> {
        return await this.keyclockService.loadUserProfile();
    }

    /**
     * Get role of the user
     *
     * @returns string
     */
    getRole() {
        const setA = new Set(this.keyclockService.getUserRoles());
        const setB = new Set(ROLE_ADMIN);

        for (const elem of setB) {
            if (setA.has(elem)) {
                return elem;
            }
        }
    }

    /**
     * Check if it is ADMIN role
     *
     * @returns boolean
     */
    hasAdminRole(): boolean {
        const setA = new Set(this.keyclockService.getUserRoles());
        const setB = new Set(ROLE_ADMIN);

        for (const elem of setB) {
            if (!setA.has(elem)) { return false; }
            return true;
        }
    }


    /**
     * Get all roles of the user
     *
     * @returns Array string
     */
    getRoles() {
        return this.keyclockService.getUserRoles();
    }

}
