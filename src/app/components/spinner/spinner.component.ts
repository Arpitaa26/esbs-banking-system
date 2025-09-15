import { Component, type OnInit, type OnDestroy } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Subscription } from "rxjs"
import { SpinnerService } from "../../services/spinner.service"
import { trigger, transition, style, animate } from "@angular/animations"
import { SpinnerState } from "../../app.enums"

@Component({
  selector: "app-spinner",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./spinner.component.html",
  styleUrls: ["./spinner.component.scss"],
  animations: [
    trigger("fadeInOut", [
      transition(":enter", [style({ opacity: 0 }), animate("300ms ease-in", style({ opacity: 1 }))]),
      transition(":leave", [animate("300ms ease-out", style({ opacity: 0 }))]),
    ]),
    trigger("scaleIn", [
      transition(":enter", [
        style({ transform: "scale(0.8)", opacity: 0 }),
        animate("300ms cubic-bezier(0.68, -0.55, 0.265, 1.55)", style({ transform: "scale(1)", opacity: 1 })),
      ]),
      transition(":leave", [animate("200ms ease-in", style({ transform: "scale(0.8)", opacity: 0 }))]),
    ]),
  ],
})
export class SpinnerComponent implements OnInit, OnDestroy {
  spinnerState: SpinnerState = { isVisible: false, message: "Loading..." }
  private subscription: Subscription = new Subscription()

  constructor(private spinnerService: SpinnerService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.spinnerService.spinner$.subscribe((state: SpinnerState) => {
        this.spinnerState = state
      }),
    )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  onOverlayClick(event: Event): void {}
}
