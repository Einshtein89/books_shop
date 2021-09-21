import {
  Component,
  ComponentRef,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {EntityList} from "../entity-list/entity-list.component";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {UserService} from "../../../services/user/user.service";
import {PaginationService} from "../../../services/pagination.service";
import {AddEditEntityComponent} from "../add-edit-entity/add-edit-entity.component";
import {SearchResultListComponent} from "./search-result-list/search-result-list.component";
import {SearchResultComponent} from "./search-result/search-result.component";
import {User} from "../../../models/user.model";
import {ComponentFactory} from "../../../component-factory/component-factory";
declare var $ : any;

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.less'],
  animations: [
    trigger('searchState', [
      state('inactive', style({
        width: '30px',
      })),
      state('active',   style({
        width: '200px',
      })),
      transition('inactive <=> active', animate('200ms ease-out'))
    ])
  ]
})
export class SearchComponent implements OnInit {

  @Input() entityListComponent: EntityList;
  results: User[] = [];
  searchState: string = 'inactive';
  @ViewChild('searchResult', {read: ViewContainerRef}) searchResultContainerRef;
  expComponent: ComponentRef<any>;
  _loading: boolean;


  constructor(private userService: UserService,
              private componentFactory: ComponentFactory) { }

  ngOnInit() {
  }

  search(value: any) {
    if (value && value.length > 1) {
      this._loading = true;
      this.userService.searchByFirstOrLastName(value)
        .subscribe(
          data => {
            this._populateSearchResults(data);
            this._showSearchResult();
          },
          errorCode =>  this.entityListComponent.statusCode = errorCode,
          () => this._loading = false
        );
    }
  }
  private resetInput(searchInput: any) {
    searchInput.value = "";
  }

  private _showSearchResult () {
    this.expComponent =  this.componentFactory.getComponent(SearchResultListComponent, this.searchResultContainerRef);
    this.expComponent.instance._searchResults = this.results;
    $("body").append('<div class="modal-backdrop fade in"></div>');
    this.removeFading(this);
  }

  private _populateSearchResults(data: any) {
    this.results = data["_embedded"].users;
  }

  private removeFading(self) {
    $(".modal-backdrop").click(function () {
      $(this).remove();
      self.expComponent.destroy();
    })
  }

  getSearchState(value: any): string {
    if (value.length === 0) {
      return 'inactive';
    }
    return 'active';
  }
}
