import { Injectable } from "@angular/core"
import { BehaviorSubject, type Observable } from "rxjs"
import { SpinnerState } from "../app.enums"

@Injectable({
  providedIn: "root",
})
export class SpinnerService {
  private spinnerSubject = new BehaviorSubject<SpinnerState>({
    isVisible: false,
    message: "Loading...",
  })

  public spinner$: Observable<SpinnerState> = this.spinnerSubject.asObservable()

  show(message?: string): void {
    this.spinnerSubject.next({
      isVisible: true,
      message: message || "Loading...",
    })
  }

  hide(): void {
    this.spinnerSubject.next({
      isVisible: false,
      message: "Loading...",
    })
  }

  showLoading(message?: string): void {
    this.show(message || "Loading...")
  }

  showSaving(message?: string): void {
    this.show(message || "Saving...")
  }

  showProcessing(message?: string): void {
    this.show(message || "Processing...")
  }

  showUploading(message?: string): void {
    this.show(message || "Uploading...")
  }

  showWithTimeout(message?: string, duration = 3000): void {
    this.show(message || "Loading...")
    setTimeout(() => {
      this.hide()
    }, duration)
  }
}
