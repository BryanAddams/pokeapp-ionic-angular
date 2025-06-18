import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'pokedex',
    pathMatch: 'full',
  },
  {
    path: 'pokedex',
    loadComponent: () =>
      import('./pokedex/pokedex.page').then(m => m.PokedexPage),
  },
  {
    path: 'pokemon/:name',
    loadComponent: () =>
      import('./pokemon-detail/pokemon-detail.page').then(m => m.PokemonDetailPage), // Certifique-se que PokemonDetailPage está exportado corretamente
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
