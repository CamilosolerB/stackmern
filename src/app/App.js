import React, { Component} from 'react';
import { render } from 'react-dom'
import Swal from 'sweetalert2';

const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
  })
  
class App extends Component {    

constructor(){
    super();
    this.state = {
        title: '',
        description: '',
        task: [],
        _id: ''
    }
    this.handleChage = this.handleChage.bind(this);
    this.addtasks = this.addtasks.bind(this);
}


    componentDidMount(){
        this.gettask();
    }
    gettask(){
        fetch('/api/task')
            .then(res =>res.json())
            .then(data =>{ 
                console.log(data)
                this.setState({task: data})
            })
    }

    addtasks(e){
        if(this.state._id){
            fetch('/api/task/'+this.state._id, {
                method: 'PUT',
                body: JSON.stringify(this.state),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(res => res.json())
            .then(data =>{
                M.toast({html: 'Task Updated'});
                this.setState({title: '', description: '', _id: ''});
                this.gettask();
            })
            .catch(err => console.error(err));
    }
    else{
        fetch('/api/task/', {
            method: 'POST',
            body: JSON.stringify(this.state),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data =>{
            M.toast({html: 'Task saved'});
            this.setState({title: '', description: ''});
            this.gettask();
        })
        .catch(err => console.error(err));
    }
        e.preventDefault();
    }

    deletetask(id){
        swalWithBootstrapButtons.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true
          }).then((result) => {
            if (result.isConfirmed) {
              swalWithBootstrapButtons.fire(
                'Deleted!',
                'Your file has been deleted.',
                'success'
              )
              fetch('/api/task/'+id,{
                method:'DELETE',
            })
            .then(res => res.json())
            .then(data =>{
                M.toast({html : 'Task deleted'});
                this.gettask();
            })
            } else if (
              /* Read more about handling dismissals below */
              result.dismiss === Swal.DismissReason.cancel
            ) {
              swalWithBootstrapButtons.fire(
                'Cancelled',
                'Your imaginary file is safe :)',
                'error'
              )
            }
          })
    }

    updatetask(id){
        fetch('/api/task/'+id,{
            method: 'GET'
        })
            .then(res => res.json())
            .then(data =>{ this.setState({
                title: data.title,
                description: data.description,
                _id: data._id
            }),
            console.log(data)
        });
        
    }

    handleChage(e){
        const {name, value} = e.target;
        this.setState({
            [name]: value
        });
    }
    render(){
        return(
            <div>
                {/* Navegacion*/}
                <nav className='light-blue darken-4'>
                    <div className='container'>
                        <a className='brand-logo' href='/'>MERN Stack</a>
                    </div>
                </nav>
                <div className='container'>
                    <div className='row'>
                        <div className='col s5'>
                            <div className='card'>
                                <div className='card-content'>
                                    <form onSubmit={this.addtasks}>
                                        <div className='row'>
                                            <div className='input-field col s12'>
                                                <input name='title' onChange={this.handleChage} type="text" value={this.state.title} placeholder='Task Title'/>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='input-field col s12'>
                                                <textarea name='description' onChange={this.handleChage} value={this.state.description} className='materialize-textarea' placeholder='task description'></textarea>
                                            </div>
                                        </div>
                                        <button type='submit' className='btn light-blue darken-4'>Send!</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className='col s7'>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Description</th>
                                        <th>Operations</th>
                                    </tr>
                                </thead>
                                    <tbody>
                                        {
                                            this.state.task.map(task =>{
                                                return(
                                                    <tr key={task._id}>
                                                        <td>{task.title}</td>
                                                        <td>{task.description}</td>
                                                        <td>
                                                            <button className='btn ligth-blue darken-4' onClick={() => this.updatetask(task._id)}><i className='material-icons'>edit</i></button>
                                                            <button className='btn ligth-blue darken-4' style={{margin: 4}} onClick={() => this.deletetask(task._id)}><i className='material-icons'>delete</i></button>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            )
    }
}

export default App;