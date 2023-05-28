import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { List } from 'src/app/models/list';
import { User } from 'src/app/models/user';
import { ListService } from 'src/app/services/list/list.service';

@Component({
  selector: 'app-list-creation',
  templateUrl: './list-creation.component.html',
  styleUrls: ['./list-creation.component.css']
})
export class ListCreationComponent {
  listaForm: FormGroup;
  Titulo: FormControl;
  Privacidade: FormControl;
  list?: List;


  constructor(
    private listService: ListService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ListCreationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User }) {
    this.Titulo = new FormControl('',[Validators.required,
      Validators.maxLength(100)]);
    this.Privacidade = new FormControl('',[Validators.required]);


    this.listaForm = this.fb.group({
      Titulo: this.Titulo,
      Privacidade: this.Privacidade,
    });
  }

  getErrorTituloMessage(){
    if (this.Titulo.hasError('required')) {
      return 'A lista tem que ter um nome!';
    }
    if (this.Titulo.hasError('maxlength')){
      return 'Não pode ter mais que 100 caracteres!';
    }
    return '';
  }

  getErrorPrivacidadeMessage(){
    if(this.Privacidade.hasError('required')){
      return 'Obrigatório!';
    }
    return '';
  }

  doSomething():void{
    const title = this.Titulo.value;
    const privacy = this.Privacidade.value;
    console.log(title);
    console.log(privacy);
    if(title!="" && title.length < 100 && privacy != ""){
      this.listService.addList({title, privacy} as List).subscribe(result => {
        console.log(result);
        console.log(this.data.user);
        this.data.user.lists.push(result);
        console.log(this.data.user);
        this.dialogRef.close(this.data.user);
      })
    }
  }

}
