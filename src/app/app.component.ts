import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { ApiService } from './services/api.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UsersService } from './services/users.service';
import { UserModel } from './models/user.model';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'crudForm';
  displayedColumns: string[] = ['userName', 'age', 'gender', 'country', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private api: ApiService, private userSvc: UsersService) {
  }

  ngOnInit(): void {
    this.getAllUsers();
  }

  openDialog(user?: UserModel): void {
    this.dialog.open(DialogComponent, {
      width: '30%',
      data: user
    }).afterClosed().subscribe(val => {
      console.log(this.dataSource)
      const index: number = this.dataSource.data.findIndex( data => data.id === val.id)
      if (index !== -1) {
        const data = [...this.dataSource.data]
        data[index] = val
        this.dataSource.data = [...data]
      } else {
        this.dataSource.data = [...this.dataSource.data, val]
      }
    })
  }

  async getAllUsers(): Promise<void> {
    try {
      const users: UserModel[] = await this.userSvc.getUsers()
      this.dataSource = new MatTableDataSource(users)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } catch (e) {
      console.error(e)
    }
  }

  async deleteUser(id: number): Promise<void> {
    try {
      await this.userSvc.delete(id)
      const index: number = this.dataSource.data.findIndex( user => user.id === id)
      const data = [...this.dataSource.data]
      data.splice(index, 1)
      this.dataSource.data = data.map( d => d )
    } catch (e) {
      console.error(e)
    }
    
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
