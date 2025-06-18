import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private favoritesSet = new Set<string>();
  private favoritesSubject = new BehaviorSubject<Set<string>>(this.favoritesSet);

  favorites$ = this.favoritesSubject.asObservable();

  constructor() {
    // Aqui você pode carregar do localStorage, por exemplo
  }

  isFavorite(name: string): boolean {
    return this.favoritesSet.has(name);
  }

  toggleFavorite(name: string): void {
    if (this.favoritesSet.has(name)) {
      this.favoritesSet.delete(name);
    } else {
      this.favoritesSet.add(name);
    }
    // Emitir uma cópia nova para atualizar os subscribers
    this.favoritesSubject.next(new Set(this.favoritesSet));
  }

  getFavorites(): string[] {
    return Array.from(this.favoritesSet);
  }
  
}
