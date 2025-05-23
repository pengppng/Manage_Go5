import { Component, ChangeDetectionStrategy, inject, model, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { merge } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { UserService } from '../../../services/user.service';
import { Users } from 'lucide-angular';

export interface DialogData {
  name: string;
  email: string;
  phone: string;
}

@Component({
  selector: 'dialogAdd',
  templateUrl: 'dialog-add.component.html',
  styleUrl: './dialog-add.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    /*MatDialogClose,*/
    MatSelectModule,
  ],
})
export class DialogAddComponent {
  readonly addUserForm: FormGroup;
  readonly errorMessage = signal('');

  roleTypes = [
    { id: 'AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA', name: 'Super Admin' },
    { id: 'BBBBBBBB-BBBB-BBBB-BBBB-BBBBBBBBBBBB', name: 'Admin' },
    { id: 'CCCCCCCC-CCCC-CCCC-CCCC-CCCCCCCCCCCC', name: 'HR Admin' },
    { id: 'DDDDDDDD-DDDD-DDDD-DDDD-DDDDDDDDDDDD', name: 'Employee' }
  ];

  permissions = signal([
    { module: 'Super Admin', read: false, write: false, delete: false },
    { module: 'Admin', read: false, write: false, delete: false },
    { module: 'Employee', read: false, write: false, delete: false },
    { module: 'Lorem Ipsum', read: false, write: false, delete: false }
  ]);

  constructor(private fb: FormBuilder , 
    readonly dialogRef : MatDialogRef<DialogAddComponent>,
    private userService : UserService
  ) {
    
    this.addUserForm = this.fb.group({
      // userId: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobileNo: [''],
      roleType: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });

    merge(
      this.addUserForm.get('email')!.statusChanges,
      this.addUserForm.get('email')!.valueChanges
    )
    .pipe(takeUntilDestroyed())
    .subscribe(() => this.updateErrorMessage());
  }

  updateErrorMessage() {
    const emailCtrl = this.addUserForm.get('email');
    if (emailCtrl?.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else if (emailCtrl?.hasError('email')) {
      this.errorMessage.set('Not a valid email');
    } else {
      this.errorMessage.set('');
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onAddUser(): void {
    if (this.addUserForm.valid) {
      const result = {
        ...this.addUserForm.value,
        permissions: this.permissions()
      };
      console.log('Result:', result);
      this.dialogRef.close(result);


      // //return user id
      // this.userService.createUser(Users).subscribe({
      //   next: (createdUser) => {
      //     console.log('User created with ID:', createdUser.id);
      //     this.dialogRef.close(createdUser); // ส่งกลับไปให้ parent component
      //   },
      //   error: (err) => {
      //     console.error('Error creating user:', err);
      //     this.errorMessage.set('Error creating user.');
      //   }
      // });

    }
  }

  togglePermission(index: number, type: 'read' | 'write' | 'delete') {
    const updated = [...this.permissions()];
    updated[index][type] = !updated[index][type];
    this.permissions.set(updated);
  }
}
