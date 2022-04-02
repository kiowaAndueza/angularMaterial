import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { UserModel } from '../models/user.model';
import { UsersService } from '../services/users.service';
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  userForm !: FormGroup;

  constructor(private formBuilder: FormBuilder, private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<DialogComponent>,
    private userSvc: UsersService) { }

  ngOnInit(): void {
    this.buildForm(this.editData)

    // if (this.editData) {
    //   this.actionBtn = "Update";
    //   this.userForm.controls['userName'].setValue(this.editData.userName);
    //   this.userForm.controls['age'].setValue(this.editData.age);
    //   this.userForm.controls['gender'].setValue(this.editData.gender);
    //   this.userForm.controls['country'].setValue(this.editData.country);
    // }
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      alert('hay errores')
      return;
    }

    const user: UserModel = this.userForm.getRawValue()
    user.id ? this.updateUser(user) : this.addUser(user)
  }

  get id(): number | null {
    return this.userForm?.get('id')?.value
  }

  async addUser(current: UserModel) {
    try {
      const user: UserModel = await this.userSvc.create(current)
      this.dialogRef.close(user)
    } catch (e) {
      console.error(e)
    }
    // if (this.editData) {
    //   this.updateUser();
    // } else {
    //   if (this.userForm.valid) {
    //     this.api.postUser(this.userForm.value)
    //       .subscribe({
    //         next: (res) => {
    //           alert("Product added successfuly");
    //           this.userForm.reset();
    //           this.dialogRef.close('save');
    //         },
    //         error: () => {
    //           alert("Error while adding the product")
    //         }
    //       })
    //   }
    // }

  }

  async updateUser(current: UserModel): Promise<void> {
    try {
      const user: UserModel = await this.userSvc.update(current)
      this.dialogRef.close(user)
    } catch (e) {
      console.error(e)
    }
    // this.api.putUser(this.userForm.value, this.editData.id)
    //   .subscribe({
    //     next: (res) => {
    //       alert("User updated successfully");
    //       this.userForm.reset();
    //       this.dialogRef.close('update');
    //     },
    //     error: () => {
    //       alert("Error while updating the user");
    //     }
    //   })
  }


  private buildForm(user?: any): void {
    this.userForm = this.formBuilder.group({
      id: [user?.id],
      userName: [user?.userName, [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      age: [user?.age, [Validators.required, Validators.min(1), Validators.max(100)]],
      gender: [user?.gender, Validators.required],
      country: [user?.country, [Validators.required, Validators.minLength(4), Validators.maxLength(24)]]
    });
  }

}
