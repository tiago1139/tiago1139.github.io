import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Avaliacao } from 'src/app/models/avaliacao';

@Component({
  selector: 'app-avaliacao-dialog',
  templateUrl: './avaliacao-dialog.component.html',
  styleUrls: ['./avaliacao-dialog.component.css']
})
export class AvaliacaoDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<AvaliacaoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Avaliacao,
  ) {
   
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  
}
