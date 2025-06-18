import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonThumbnail, IonLabel } from '@ionic/angular/standalone';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-pokedex',
  templateUrl: './pokedex.page.html',
  styleUrls: ['./pokedex.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonList,
    IonItem,
    IonThumbnail,
    IonLabel,
    CommonModule,
    HttpClientModule
  ],
})
export class PokedexPage implements OnInit {

  pokemons: { id: number, name: string, image: string }[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadPokemons();
  }

  loadPokemons() {
    this.http.get<{ results: { name: string; url: string }[] }>('https://pokeapi.co/api/v2/pokemon?limit=100')
      .subscribe(response => {
        this.pokemons = response.results.map(pokemon => {
          const id = this.extractIdFromUrl(pokemon.url);
          return {
            id,
            name: pokemon.name,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
          };
        });
      });
  }

  extractIdFromUrl(url: string): number {
    const parts = url.split('/');
    return Number(parts[parts.length - 2]); // extrai o ID da URL
  }

}
