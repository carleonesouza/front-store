import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FuseVerticalNavigationAppearance, FuseVerticalNavigationMode, FuseNavigationItem, FuseVerticalNavigationPosition, FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { AuthService } from 'app/core/auth/auth.service';
import { User } from 'app/models/user';
import { Subject } from 'rxjs';
import { PagesService } from './pages.service';

@Component({
    selector: 'app-page',
    templateUrl: './page.component.html',
})
export class PageComponent implements OnInit, OnDestroy, AfterViewInit {

    @Input() appearance: FuseVerticalNavigationAppearance;
    @Input() autoCollapse: boolean;
    @Input() inner: boolean;
    @Input() mode: FuseVerticalNavigationMode;
    @Input() name: string;
    @Input() navigation: FuseNavigationItem[];
    @Input() isScreenSmall: boolean;
    @Input() position: FuseVerticalNavigationPosition;
    @Input() transparentOverlay: boolean;
    user: User;
    private navigationData: FuseNavigationItem[] = [
        {
            id: 'home',
            title: 'Home',
            type: 'basic',
            icon: 'heroicons_outline:home',
            link: '/inicio'
        },
        {
            id: 'pacientes',
            title: 'Visão singular',
            type: 'basic',
            icon: 'heroicons_outline:heart',
            link: '/pacientes'
        },
        // {
        //     id: 'prescricao',
        //     title: 'Prescrição',
        //     type: 'basic',
        //     icon: 'mat_solid:medication',
        //     link: '/prescricao'
        // },
        {
            id: 'admin',
            title: 'Administrativo',
            subtitle: '',
            type: 'collapsable',
            icon: 'mat_outline:settings',
            children: [
                {
                    id: 'cadastros',
                    title: 'Gestão de Cadastros',
                    subtitle: '',
                    type: 'collapsable',
                    icon: 'heroicons_outline:database',
                    children: [
                        {
                            id: 'individuos',
                            title: 'Indivíduo',
                            type: 'basic',
                            icon: 'heroicons_outline:user-group',
                            link: 'admin/individuo/lista'
                        },
                        {
                            id: 'cidades',
                            title: 'Cidade',
                            type: 'basic',
                            icon: 'mat_outline:location_city',
                            link: 'admin/cidade/lista'
                        },
                        {
                            id: 'escolaridades',
                            title: 'Escolaridade',
                            type: 'basic',
                            icon: 'mat_outline:school',
                            link: 'admin/escolaridade/lista'
                        },
                        {
                            id: 'estados',
                            title: 'Estado',
                            type: 'basic',
                            icon: 'mat_outline:map',
                            link: 'admin/estado/lista'
                        },
                        {
                            id: 'generos',
                            title: 'Gênero',
                            type: 'basic',
                            icon: 'mat_outline:transgender',
                            link: 'admin/genero/lista'
                        },
                        {
                            id: 'racas',
                            title: 'Raça',
                            type: 'basic',
                            icon: 'mat_outline:people',
                            link: 'admin/raca/lista'
                        },
                        {
                            id: 'sexos',
                            title: 'Sexo',
                            type: 'basic',
                            icon: 'mat_outline:6_ft_apart',
                            link: 'admin/sexo/lista'
                        },
                        // {
                        //     id: 'documentos',
                        //     title: 'Tipo Documento',
                        //     type: 'basic',
                        //     icon: 'mat_outline:badge',
                        //     link: 'admin/documento/lista'
                        // },
                        {
                            id: 'vinculo',
                            title: 'Tipo Vínculo',
                            type: 'basic',
                            icon: 'mat_outline:checklist',
                            link: 'admin/tipo-vinculo/lista'
                        },
                        // {
                        //     id: 'tipexames',
                        //     title: 'Tipo Exame',
                        //     type: 'basic',
                        //     icon: 'mat_outline:healing',
                        //     link: 'admin/tipo-exame/lista'
                        // },
                        // {
                        //     id: 'exame',
                        //     title: 'Exame',
                        //     type: 'basic',
                        //     icon: 'mat_outline:medication',
                        //     link: 'admin/exame/lista'
                        // },
                        // {
                        //     id: 'especialidades',
                        //     title: 'Especialidades',
                        //     type: 'basic',
                        //     icon: 'mat_outline:health_and_safety',
                        //     link: 'admin/especialidade/lista'
                        // },
                        // {
                        //     id: 'condicaoclinica',
                        //     title: 'Condição Clínica',
                        //     type: 'basic',
                        //     icon: 'mat_outline:personal_injury',
                        //     link: 'admin/condicao-clinica/lista'
                        // }
                    ]
                },
                {
                    id:'settings',
                    title: 'Configurações',
                    subtitle: '',
                    type:'collapsable',
                    icon:'mat_outline:settings',
                    children:[
                        {
                            id: 'account',
                            title: 'Conta',
                            type: 'basic',
                            icon: 'mat_outline:manage_accounts',
                            link: 'admin/configuracoes/conta/lista'
                        },
                        {
                            id: 'roles',
                            title: 'Perfis',
                            type: 'basic',
                            icon: 'mat_outline:supervisor_account',
                            link: 'admin/configuracoes/perfil/lista'
                        },
                        {
                            id: 'routes',
                            title: 'Rota',
                            type: 'basic',
                            icon: 'mat_outline:follow_the_signs',
                            link: 'admin/configuracoes/rota/lista'
                        },
                        {
                            id: 'systems',
                            title: 'Serviço',
                            type: 'basic',
                            icon: 'mat_outline:roofing',
                            link: 'admin/configuracoes/servico/lista'
                        },
                    ]
                },
                {

                        id: 'customers',
                        title: 'Cliente',
                        subtitle: '',
                        type: 'basic',
                        icon: 'mat_outline:support_agent',
                        link: 'admin/clientes/lista',
                },
                // {
                //     id: 'account',
                //     title: 'Conta',
                //     type: 'basic',
                //     icon: 'mat_outline:supervised_user_circle',
                //     link: 'admin/customers/accounts'
                // },
                // {
                //     id: 'contracts',
                //     title: 'Contrato',
                //     type: 'basic',
                //     icon: 'mat_outline:receipt_long',
                //     link: 'admin/customers/contracts/list'
                // },
                {
                    id: 'products',
                    title: 'Produto',
                    type: 'basic',
                    icon: 'mat_outline:storefront',
                    link: 'admin/produtos/lista'
                },
                // {
                //     id: 'equipe',
                //     title: 'Equipe',
                //     type: 'basic',
                //     icon: 'mat_outline:group_work',
                //     link: 'admin/equipe/lista'
                // },
                {
                    id: 'programacliente',
                    title: 'Programa Cliente',
                    type: 'basic',
                    icon: 'mat_outline:business_center',
                    link: 'admin/programa-cliente/lista'
                },
                {
                    id: 'programasaude',
                    title: 'Programa Saúde',
                    type: 'basic',
                    icon: 'mat_outline:spa',
                    link: 'admin/programa-saude/lista'
                },
            ]
        },

    ];
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    private isAuth = false;


    /**
     * Constructor
     */
    constructor(private _fuseNavigationService: FuseNavigationService,
        private _authService: AuthService, private _router: Router, private _pagesService: PagesService) { }


    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for current year
     */
    get currentYear(): number {
        return new Date().getFullYear();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit() {

        this._authService.getRole();

        //Check if user if Authorized
        if (this._authService.check()) {
            this._authService.check().then((auth) => {
                this.isAuth = auth;
            });
        }
        //Set menu for specific role
        this.navigationData.map((item) => {
            if (!this._authService.hasAdminRole() && item.id === 'admin') {
                item.hidden = () => true;
            }
        });

    }

    ngAfterViewInit() {
        if (this._authService.check()) {
            this._authService.getUser().then((user) => {
                this.user = new User(user);
            });
        } else {
            this._authService.signOut();
        }
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {

        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle navigation
     *
     * @param name
     */
    toggleNavigation(name: string): void {
        // Get the navigation
        const navigation = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(name);

        if (navigation) {
            // Toggle the opened status
            navigation.toggle();
        }
    }

    checkRole(): boolean{
        if(this.isAuth){
            return true;
        }
    }

    getNavItem(itemId, navigationName): FuseNavigationItem | null {
        // Get the component -> navigation data -> item
        const navComponent = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(navigationName);

        // Return if the navigation component does not exist
        if (!navComponent) {
            return null;
        }

        // Get the navigation item
        const navigation = navComponent.navigation;
        const item = this._fuseNavigationService.getItem(itemId, navigation);
        return item;
    }

    toAuth(): boolean {
        return this.isAuth;
    }

    updateUserStatus(status: string): void {

    }

    profile(): void{
        this._router.navigate(['/profile']);
    }

    /**
     * Sign out
     */
    signOut(): void {
        this._router.navigate(['/sign-out']);
    }
}
