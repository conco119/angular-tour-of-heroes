import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'
// Observable class extensions
import 'rxjs/add/observable/of'

// Observable operator
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/debounceTime'
import 'rxjs/add/operator/distinctUntilChanged'

import { HeroSearchService } from './hero-search.service'
import { Hero } from './hero'

@Component({
  selector: 'hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css'],
  providers: [HeroSearchService]
})

export class HeroSearchComponent implements OnInit {
  heroes: Observable<Hero[]>;
  testing: string;
  private searchTerms = new Subject<string>();
  number1: number = 1;
  number2: number;
  constructor(
    private heroSearchService: HeroSearchService,
    private router: Router
  ) { }

  //push a search term into the observable stream

  search(term: string): void {
    this.searchTerms.next(term);
    this.number1++;
    console.log(this.number2);
    console.log(this.heroes);

  }

  ngOnInit(): void {
    console.log(this.searchTerms);
    this.heroes = this.searchTerms
      .debounceTime(300) //// wait 300ms after each keystroke before considering the term
      .distinctUntilChanged() // ignore if next search term is same as previous
      .switchMap(term => term
        // return the http bbservable
        ? this.heroSearchService.search(term)
        //or the observable of empty heroes if there was no search term
        : Observable.of<Hero[]>([]))
      .catch(error => {
        //TODO: add real error handling
        console.log(error);
        return Observable.of<Hero[]>([]);
      })
    this.number2 = this.number1;
  }

  gotoDetail(hero: Hero): void {
    let link = ['/detail', hero.id];
    this.router.navigate(link);
  }

}
