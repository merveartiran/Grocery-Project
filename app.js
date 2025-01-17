// ****** SELECT ITEMS **********

const alert=document.querySelector('.alert');
const form=document.querySelector('.grocery-form');
const grocery=document.getElementById('grocery');
const submitBtn=document.querySelector('.submit-btn');
const container=document.querySelector('.grocery-container');
const list=document.querySelector('.grocery-list');
const clearBtn=document.querySelector('.clear-btn');






// edit option

let editElement;
let editFlag=false;
let editID="";


// ****** EVENT LISTENERS **********
form.addEventListener('submit',addItem)

//clear items
clearBtn.addEventListener('click',clearItems);
//load items
window.addEventListener('DOMContentLoaded',setupItems);




// ****** FUNCTIONS **********

function addItem(e){
    e.preventDefault();
    const value=grocery.value;
    const id=new Date().getTime().toString();
    let items = getLocalStorage();
    let existingItem = items.find(item => item.value === value);

    if(value && !existingItem && editFlag===false){
      createListItem(id,value);

      //display alert
      displayAlert('item added to the list','success');
      //show container
      container.classList.add('show-container');
      //add to local storage
      addItemToLocalStorage(id,value);
      //set back to default
      setBackToDefault();
    } else if (existingItem && editFlag === false) {
      displayAlert('Bu ürün sepette zaten var', 'danger');
    } else if(value && editFlag){
        editElement.innerHTML=value;
       
        displayAlert('value changed','success');
        //edit local storage;
         editLocalStorage(editID,value);
        //editLocalStorage(id,value);
        setBackToDefault();
    } else{
        
       displayAlert('please enter value',"danger")
    }   
}





//function deneme aşağıdaki add item fonksiyonu aynı ürünü eklemk istediğinizde uyarı vermiyor.
// ***************************************
// function addItem(e){
//     e.preventDefault();
//     const value=grocery.value;
//     const id=new Date().getTime().toString();
//     if(value && editFlag===false){
//       createListItem(id,value);

// //display alert
// displayAlert('item added to the list','success');
// //show container
// container.classList.add('show-container');
// //add to local storage
// addItemToLocalStorage(id,value);
// //set back to default
// setBackToDefault();


// }

//     else if(value && editFlag){
//         editElement.innerHTML=value;
       
//         displayAlert('value changed','success');
//         //edit local storage;
//          editLocalStorage(editID,value);
//         //editLocalStorage(id,value);
//         setBackToDefault();
//     }
//     else{
        
//        displayAlert('please enter value',"danger")
//     }   
    
    
// }

//***************************************************


//display alert
function displayAlert(text,action){
    alert.textContent=text;
    alert.classList.add(`alert-${action}`);
    //remove alert
    setTimeout(() => {
        alert.textContent="";
    alert.classList.remove(`alert-${action}`);
    },1000)
}
function clearItems(){
    const items=document.querySelectorAll('.grocery-item');
    if(items.length>0){
        items.forEach(item=>{
            list.removeChild(item);

        })
    }
    container.classList.remove('show-container');
    displayAlert('empty list',"danger");
    setBackToDefault();
     localStorage.removeItem('list')
}


//edit function
function editItem(e){
    e.preventDefault();
    const item=e.currentTarget.parentElement.parentElement;
    const id=item.dataset.id;
    //set edit item
    editElement=e.currentTarget.parentElement.previousElementSibling;
    //set form value
    grocery.value=editElement.innerHTML;
    editFlag=true;
    editID=id;
    submitBtn.textContent="edit";
}
//delete function
function deleteItem(e){
    e.preventDefault();
    const item=e.target.parentElement.parentElement.parentElement;
    const id=item.dataset.id;
    // console.log(item,id);
    list.removeChild(item);
    // console.log("item deleted");
    if(list.children.length===0){
        container.classList.remove('show-container');
    }
    displayAlert('basket is empty','danger');
    setBackToDefault();
    //remove from local storage
 removeFromLocalStorage(id);

}
//set back to default
function setBackToDefault(){
    grocery.value="";
    
    editFlag=false;
    editID="";
    submitBtn.textContent="submit"
}
// ****** LOCAL STORAGE **********
function addItemToLocalStorage(id,value){
 const grocery={id,value};
//  const grocery={id:id,value:value};
//  console.log(grocery);
 let items= getLocalStorage();
// console.log("added to local storage");
// console.log(items);

items.push(grocery);
localStorage.setItem('list',JSON.stringify(items));
}
function removeFromLocalStorage(id){
let items=getLocalStorage();

items= items.filter(function(item){
if(item.id!==id){
    return item;
}
})
localStorage.setItem('list',JSON.stringify(items));
}
function editLocalStorage(id,value){
    let items=getLocalStorage();
    items=items.map(function(item){
        if(item.id===id){
            item.value=value;
        }
        return item;
        
    });
    localStorage.setItem('list',JSON.stringify(items));

}
function getLocalStorage() {
 return  localStorage.getItem("list")?JSON.parse(localStorage.getItem("list")):[];
  }
//local storage API
//set item
//get item
//remove item
//save as strings
// localStorage.setItem("orange",JSON.stringify(["item1","item2"]));
// const oranges=JSON.parse(localStorage.getItem("orang"))
// localStorage.removeItem('orange');
// ****** SETUP ITEMS **********

function setupItems(){
    let items=getLocalStorage();
    if(items.length>0){
items.forEach(function(item){
createListItem(item.id,item.value)
})
container.classList.add('show-container');
    }
}
function createListItem(id,value){
    const element=document.createElement('article');
    //add class
    element.classList.add('grocery-item');
    // add id
    const attr=document.createAttribute('data-id');
    attr.value=id;
    element.setAttributeNode(attr);
    element.innerHTML=`<p class="title">${value}</p>
                <div class="btn-container">
                  <button type="button" class="edit-btn">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button type="button" class="delete-btn">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>`;
    
    const deleteBtn=element.querySelector('.delete-btn');
    const editBtn=element.querySelector('.edit-btn');
    deleteBtn.addEventListener('click',deleteItem);
    editBtn.addEventListener('click',editItem);
    
    //append child
    list.appendChild(element);
}