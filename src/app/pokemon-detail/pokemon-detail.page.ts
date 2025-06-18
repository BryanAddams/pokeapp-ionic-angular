import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FavoritesService } from '../favorite.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule, FormsModule],
  template: `
  <ion-header>
    <ion-toolbar color="danger">
      <ion-buttons slot="start">
        <ion-back-button defaultHref="/" icon="arrow-back" text="" aria-label="Voltar"></ion-back-button>
      </ion-buttons>
      <ion-title>{{ pokemon?.name | titlecase }}</ion-title>
      <ion-buttons slot="end">
        <ion-button (click)="toggleFavorite()" fill="clear" aria-label="Favoritar Pokémon">
          <ion-icon [name]="isFavorite ? 'star' : 'star-outline'" slot="icon-only" color="warning"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content class="detail-content" scroll-y="true">
    <ion-spinner *ngIf="loading" name="crescent" class="loading-spinner"></ion-spinner>

    <div *ngIf="error" class="error-message" role="alert">
      <p>Erro ao carregar o Pokémon. Por favor, tente novamente.</p>
      <ion-button color="danger" (click)="fetchPokemon()">Tentar novamente</ion-button>
    </div>

    <ion-card *ngIf="pokemon && !loading">
      <ion-card-content>
  <ion-grid>
    <ion-row>
      <!-- Informações à esquerda -->
      <ion-col size="7" class="ion-align-self-center">
        <h2 style="margin-bottom: 0;">{{ pokemon.name | titlecase }}</h2>
        <h3 style="margin-top: 0; color: #888;">#{{ formatNumber(pokemon.id) }}</h3>
        <p><strong>Altura:</strong> {{ pokemon.height / 10 }} m</p>
        <p><strong>Peso:</strong> {{ pokemon.weight / 10 }} kg</p>
        <p><strong>Tipos:</strong> {{ getTypes() }}</p>
        <p><strong>Habilidades:</strong> {{ getAbilities() }}</p>
        <p><strong>Experiência Base:</strong> {{ pokemon.base_experience }}</p>
      </ion-col>
      <!-- Imagem à direita -->
      <ion-col size="5" class="ion-text-end ion-align-self-center">
        <img [src]="getSprite('front')" alt="{{ pokemon.name }}" style="width: 160px; height: 160px; object-fit: contain;" />
      </ion-col>
    </ion-row>
  </ion-grid>

  <ion-button (click)="playCry()" expand="block" fill="outline" color="medium" style="margin-top: 1rem;">
    <ion-icon name="volume-high-outline" slot="start"></ion-icon>
    Grito de Guerra!
  </ion-button>

  <p><strong>Status:</strong></p>
  <ul>
    <li *ngFor="let stat of pokemon.stats">
      {{ stat.stat.name | titlecase }}: {{ stat.base_stat }}
    </li>
  </ul>

  <ion-segment [(ngModel)]="showShinyStr" color="danger" value="false" style="margin: 1rem 0;">
    <ion-segment-button value="false">Normal</ion-segment-button>
    <ion-segment-button value="true">Shiny</ion-segment-button>
  </ion-segment>

  <!-- Sprites: normal e shiny, frente e costas -->
  <div class="sprites" role="list" style="display: flex; flex-wrap: wrap; gap: 16px; justify-content: center; margin-top: 1rem;">
  <figure role="listitem">
    <img
      [src]="showShiny ? pokemon.sprites.front_shiny : pokemon.sprites.front_default"
      [alt]="showShiny ? 'Frente Shiny' : 'Frente Normal'"
      style="width: 96px; height: 96px;" />
    <figcaption>{{ showShiny ? 'Frente Shiny' : 'Frente Normal' }}</figcaption>
  </figure>
  <figure role="listitem">
    <img
      [src]="showShiny ? pokemon.sprites.back_shiny : pokemon.sprites.back_default"
      [alt]="showShiny ? 'Costas Shiny' : 'Costas Normal'"
      style="width: 96px; height: 96px;" />
    <figcaption>{{ showShiny ? 'Costas Shiny' : 'Costas Normal' }}</figcaption>
  </figure>
</div>
</ion-card-content>
    </ion-card>

    <!-- Botões de navegação dentro do conteúdo rolável -->
    <ion-grid *ngIf="pokemon && !loading" class="ion-margin-bottom">
      <ion-row class="ion-justify-content-between ion-padding-horizontal ion-margin-top">
        <ion-col size="6" class="ion-text-start">
          <ion-button
            expand="block"
            fill="outline"
            color="medium"
            [disabled]="pokemon.id === 1"
            (click)="goToPokemon(pokemon.id - 1)">
            <ion-icon name="arrow-back" slot="start"></ion-icon>
            Anterior
            <img
              *ngIf="pokemon.id > 1"
              [src]="'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + (pokemon.id - 1) + '.png'"
              alt="Anterior"
              style="width: 32px; height: 32px; margin-left: 8px;" />
          </ion-button>
        </ion-col>
        <ion-col size="6" class="ion-text-end">
          <ion-button
            expand="block"
            fill="outline"
            color="medium"
            (click)="goToPokemon(pokemon.id + 1)">
            Próximo
            <img
              [src]="'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + (pokemon.id + 1) + '.png'"
              alt="Próximo"
              style="width: 32px; height: 32px; margin-left: 8px;" />
            <ion-icon name="arrow-forward" slot="end"></ion-icon>
          </ion-button>
        </ion-col>
      </ion-row>
    </ion-grid>
    <div style="height: 32px;"></div>
  </ion-content>

  <ion-toast
    [isOpen]="toastVisible"
    [message]="toastMessage"
    duration="1500"
    color="danger"
    (ionToastDidDismiss)="toastVisible = false">
  </ion-toast>
  `,
  styles: [`
    .sprites {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-top: 1rem;
      flex-wrap: wrap;
    }

    .sprites figure {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 0;
    }

    .sprites img {
      width: 96px;
      height: 96px;
      object-fit: contain;
    }

    .loading-spinner {
      display: block;
      margin: 2rem auto;
    }

    .error-message {
      text-align: center;
      padding: 1rem;
      color: red;
    }

    ion-card {
      margin: 1rem;
    }
  `]
})
export class PokemonDetailPage implements OnInit, OnDestroy {
  pokemon: any;
  loading = true;
  error = false;
  toastVisible = false;
  toastMessage = '';
  showShinyStr: string = 'false';
  isFavorite: boolean = false;
  private favoritesSub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private favoritesService: FavoritesService,
    private location: Location  // <-- Injetado Location para voltar
  ) {}

  ngOnInit() {
  this.route.paramMap.subscribe(() => {
    this.fetchPokemon();
  });
  this.favoritesSub = this.favoritesService.favorites$.subscribe(() => {
    this.checkIfFavorite();
  });
}
  audio = new Audio();

playCry() {
  if (!this.pokemon?.name) return;

  const name = this.pokemon.name.toLowerCase();
  this.audio.src = `https://play.pokemonshowdown.com/audio/cries/${name}.mp3`;
  this.audio.load();
  this.audio.play().catch(() => {
    this.showToast('Som não disponível para este Pokémon.');
  });
}


  ngOnDestroy() {
    this.favoritesSub.unsubscribe();
  }

  fetchPokemon() {
    this.loading = true;
    this.error = false;
    const name = this.route.snapshot.paramMap.get('name');
    if (name) {
      this.http.get(`https://pokeapi.co/api/v2/pokemon/${name}`).subscribe({
        next: (data) => {
          this.pokemon = data;
          this.loading = false;
          this.checkIfFavorite();
        },
        error: () => {
          this.loading = false;
          this.error = true;
        }
      });
    }
  }

  getTypes(): string {
    return this.pokemon?.types?.map((t: any) => t.type.name).join(', ') ?? '';
  }

  getAbilities(): string {
    return this.pokemon?.abilities?.map((a: any) => a.ability.name).join(', ') ?? '';
  }

  get showShiny(): boolean {
    return this.showShinyStr === 'true';
  }

  getSprite(view: 'front' | 'back'): string {
    if (!this.pokemon || !this.pokemon.sprites) return '';
    return this.showShiny
      ? view === 'front'
        ? this.pokemon.sprites.front_shiny
        : this.pokemon.sprites.back_shiny
      : view === 'front'
        ? this.pokemon.sprites.front_default
        : this.pokemon.sprites.back_default;
  }

  formatNumber(id: number): string {
    return id.toString().padStart(3, '0');
  }

  goBack() {
    this.location.back();  // Voltar usando Location para manter histórico
  }

  checkIfFavorite() {
    if (!this.pokemon?.name) {
      this.isFavorite = false;
      return;
    }
    this.isFavorite = this.favoritesService.isFavorite(this.pokemon.name);
  }

  toggleFavorite() {
    if (!this.pokemon || !this.pokemon.name) return;

    this.favoritesService.toggleFavorite(this.pokemon.name);
    this.isFavorite = this.favoritesService.isFavorite(this.pokemon.name);

    this.showToast(
      this.isFavorite
        ? `${this.pokemon.name} adicionado aos favoritos.`
        : `${this.pokemon.name} removido dos favoritos.`
    );
  }
    goToPokemon(id: number) {
    this.http.get<any>(`https://pokeapi.co/api/v2/pokemon/${id}`).subscribe({
      next: (data) => {
        this.router.navigate(['/pokemon', data.name]);
      },
      error: () => {
        this.showToast('Pokémon não encontrado.');
      }
    });
  }

  showToast(message: string) {
    this.toastMessage = message;
    this.toastVisible = true;
  }
}

