import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { BoardSize } from "../models/BoardSize";

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  snakeSpeed$$ = new BehaviorSubject(5);
  boardSize$$ = new BehaviorSubject<BoardSize>({ rows: 26, columns: 26 });
}
