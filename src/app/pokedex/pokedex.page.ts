import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { FavoritesService } from '../favorite.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-pokedex',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
  ],
  template: `
    <ion-header>
      <ion-toolbar color="danger">
        <ion-title class="header-title">Pokédex</ion-title>
        <ion-buttons slot="end">
          <ion-button routerLink="/favorites" fill="outline" color="light">
            Lista dos Favoritos
            <ion-icon slot="end" name="star"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="pokedex-content" fullscreen>
      <table class="pokedex-table">
        <thead>
          <tr>
            <th class="favorite-column">Favoritos</th>
            <th>Nome</th>
            <th>Imagem</th>
            <th>#</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let pokemon of pokemons; let i = index" class="table-row">
            <td>
  <ion-button fill="clear" size="small" (click)="toggleFavorite(pokemon.name, $event)">
    <ion-icon
  [name]="isFavorite(pokemon.name) ? 'star' : 'star-outline'"
  [style.color]="isFavorite(pokemon.name) ? 'gold' : '#888'"
  class="favorite-icon"
></ion-icon>
  </ion-button>
</td>

            <td class="pokemon-name" (click)="goToPokemon(pokemon.name)">{{ pokemon.name | titlecase }}</td>
            <td (click)="goToPokemon(pokemon.name)">
              <img
                [src]="getPokemonImage(i + 1)"
                [alt]="pokemon.name"
                class="pokemon-thumb"
                loading="lazy"
              />
            </td>
            <td (click)="goToPokemon(pokemon.name)">{{ formatNumber(i + 1) }}</td>
          </tr>
        </tbody>
      </table>
    </ion-content>
  `,
  styles: [`
    .pokedex-content {
      --background: #121212;
      color: white;
      padding: 1rem;
    }

    ion-toolbar {
      --background: #cc0000;
      color: white;
    }

    .header-title {
      text-align: center;
      font-weight: bold;
      font-size: 1.6rem;
    }

    .pokedex-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 1.1rem;
    }

    .pokedex-table thead {
      background-color: #cc0000;
      color: white;
    }

    .pokedex-table th,
    .pokedex-table td {
      padding: 8px 10px;
      text-align: center;
      border-bottom: 1px solid #444;
      white-space: nowrap;
    }

    .pokedex-table tbody tr {
      background-color: #1e1e1e;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    .pokedex-table tbody tr:hover {
      background-color: #330000;
    }

    .pokemon-thumb {
      width: 48px;
      height: 48px;
      object-fit: contain;
      margin: 0 auto;
      display: block;
    }

    .pokemon-name {
      font-family: 'Minecraftia', cursive;
      font-size: 1.05rem;
      -webkit-font-smoothing: none;
      -moz-osx-font-smoothing: grayscale;
      image-rendering: pixelated;
      text-shadow: none;
    }
      .favorite-column {
  width: 40px;
  padding: 0;
}

.favorite-icon {
  font-size: 1.3rem;
  margin: 0;
  padding: 0;
}

  `]
})
export class PokedexPage implements OnInit {
  pokemons: any[] = [];
  favorites = new Set<string>();  // usar Set para fácil consulta

  constructor(
    private http: HttpClient,
    private router: Router,
    private favoritesService: FavoritesService  // injete o serviço
  ) {}

  ngOnInit() {
    // inscreva-se para atualizações do favoritos via serviço
    this.favoritesService.favorites$.subscribe(favs => {
      this.favorites = favs;
    });

    this.http.get<{ results: any[] }>('https://pokeapi.co/api/v2/pokemon?limit=151')
      .subscribe(res => this.pokemons = res.results);
  }

  formatNumber(num: number): string {
    return '#' + num.toString().padStart(3, '0');
  }

  getPokemonImage(index: number): string {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index}.png`;
  }

  goToPokemon(name: string) {
    this.router.navigate(['/pokemon', name]);
  }

  // FAVORITOS

  isFavorite(name: string): boolean {
    return this.favorites.has(name);
  }

  toggleFavorite(name: string, event: MouseEvent) {
    event.stopPropagation(); // evita disparar o goToPokemon
    this.favoritesService.toggleFavorite(name);
  }
}
