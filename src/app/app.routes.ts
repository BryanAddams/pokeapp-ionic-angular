import { Routes } from '@angular/router';
import { PokedexPage } from './pokedex/pokedex.page';

export const routes: Routes = [
  {
    path: '',
    component: PokedexPage,
  },
  {
    path: 'pokemon/:name',
    loadComponent: () =>
      import('./pokemon-detail/pokemon-detail.page').then((m) => m.PokemonDetailPage),
  },
  {
    path: 'favorites',
    loadComponent: () =>
      import('./favorites/favorites.page').then((m) => m.FavoritesPage),
  },
];
