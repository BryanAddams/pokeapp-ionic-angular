import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FavoritesService } from '../favorite.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, IonicModule, HttpClientModule],
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss']
})
export class FavoritesPage implements OnInit {
  favoritePokemons: any[] = [];

  constructor(
    private favoritesService: FavoritesService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.favoritesService.favorites$.subscribe(() => {
      this.loadFavorites();
    });

    this.loadFavorites(); // também carrega ao iniciar
  }

  loadFavorites() {
  const favorites = this.favoritesService.getFavorites();

  if (favorites.length === 0) {
    this.favoritePokemons = [];
    return;
  }

  const requests = favorites.map(name =>
    this.http.get<any>(`https://pokeapi.co/api/v2/pokemon/${name}`)
  );

  forkJoin(requests).subscribe({
    next: (pokemons) => {
      this.favoritePokemons = pokemons;
    },
    error: (err) => {
      console.warn('Erro ao buscar dados dos pokemons favoritos', err);
      this.favoritePokemons = [];
    }
  });
}


  goToDetails(name: string) {
    this.router.navigate(['/pokemon', name]);
  }
}
