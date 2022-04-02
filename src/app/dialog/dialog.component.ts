import { Component, Inject, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { ApiService } from '../services/api.service';
import{MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog'
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  userForm !: FormGroup;
  actionBtn : string = "Save"
  constructor(private formBuilder : FormBuilder, private api : ApiService, 
              @Inject(MAT_DIALOG_DATA) public editData : any,
              private dialogRef : MatDialogRef<DialogComponent>) {}

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      userName : ['',Validators.required],
      age : ['', Validators.required],
      gender : ['', Validators.required],
      country : ['', Validators.required]
      
    });

    if(this.editData){
      this.actionBtn = "Update";
      this.userForm.controls['userName'].setValue(this.editData.userName);
      this.userForm.controls['age'].setValue(this.editData.age);
      this.userForm.controls['gender'].setValue(this.editData.gender);
      this.userForm.controls['country'].setValue(this.editData.country);
    }

    
  }

  addUser(){
    if(this.editData){
      this.updateUser();
    } else {
      if(this.userForm.valid){
        this.api.postUser(this.userForm.value)
        .subscribe({
          next:(res)=>{
            alert("Product added successfuly");
            this.userForm.reset();
            this.dialogRef.close('save');
          },
          error:()=>{
            alert("Error while adding the product")
          }
        })
    }
    }
  
  }

  updateUser(){
    this.api.putUser(this.userForm.value, this.editData.id)
    .subscribe({
      next:(res)=>{
        alert("User updated successfully");
        this.userForm.reset();
        this.dialogRef.close('update');
      },
      error:()=>{
        alert("Error while updating the user");
      }
    })
  }

}
