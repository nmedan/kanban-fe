<template>
  <div class="container mt-4">
    <div class="board" v-for="(column, index) in columns" :key="index">
      <h3> {{ column.name }}<span v-if="column.capacity"></span></h3>
      <form v-on:submit.prevent>
        <label>Capacity: &nbsp</label>
        <input placeholder="No limit" v-model="column.capacity" type="number" :min="column.cards.length" @input="setCapacity(column.id, column)"></input>
      </form>
      <draggable v-if="column.cards" v-model="column.cards" class="dragArea" :move="checkMove" :options="{group: 'columns'}"  :column="column" :colId="column.id" :colCapacity="column.capacity" :cardsNumber="column.cards.length" @add="onAdd($event, column)" @update="onUpdate(column.id, column)"> 
	      <div class="kanbon-card" v-for="card in column.cards" :key="card.id" :cardId="card.id"> 
	      </div>
      </draggable>
    </div>
    <hr></hr>
    <h2>Add new card</h2>
    <form @submit.prevent="addCard()">
      <div class="form-group row">
        <label for="year" class="col-2 col-form-label">Select column</label>
        <div class="col-4">
          <select id="year" name="year" type="number" placeholder="Select column" class="form-control here" required="required" v-model="card.column">
            <option v-for="(column, key) in columns" :key="key" v-bind:value="column">
              {{ column.name }}
            </option>
          </select>
        </div>            
      </div> 
      <div class="form-group row">
        <div>
           <button type="submit" class="btn btn-success" >Add card</button>
        </div> 
      </div>
    </form>
  </div>
</template>


<script>
import draggable from 'vuedraggable'
import { cards } from '../services/Cards'
import { columns } from '../services/Columns'

export default {
  components: {
    draggable
  },
  
  data() {
    return {	  
	    columns: [],
	    card: {
	      column: {id: '', name: '', capacity: null, cards:[]}
	    },
      capacities: [],    
    }
	},
  
  created() {
    columns.getAll().then(response=>
    (this.columns=response.data))     
  },

  methods: { 
	  checkMove(evt) { 
      return true;        
	  },
    
    setCapacity(id, column) {
      if (!column.capacity || (column.capacity >= column.cards.length)) {
        columns.setCapacity(id, column)
        .then(
          ()=>
          {
            columns.getAll().then(response=>
            (this.columns=response.data))         
          }
        )
      }
      else {
        columns.getAll().then(response=>
        (this.columns=response.data))        
      }
    },

	  addCard() {   
      if (!this.card.column.capacity || (this.card.column.capacity > this.card.column.cards.length)) {
	      cards.add(this.card.column.id, this.card)
        .then(
          ()=>
          {
            columns.getAll().then(response=>
            (this.columns=response.data))  
          }
        )
      }
      else {
        alert('Not enough capacity')         
      }
	    this.card = {};
	  },
  
    onAdd(event, column) {
      let cardId = event.item.getAttribute('cardId');
      let colToId = event.to.getAttribute('colId');
      let colFromId = event.from.getAttribute('colId');
      if (!column.capacity || (column.capacity >= column.cards.length)) {
        cards.changeColumn(cardId, colToId)
        .then(
          ()=>
          {
            columns.getAll().then(response=>
            (this.columns=response.data))  
            .then(
            ()=>
            {
              this.onUpdate(colToId, column)
            }
            )
          }
        )
      }
      else {
        columns.getAll().then(response=>
        (this.columns=response.data))
        .then(
          ()=>
          {
            alert('Not enough capacity') 
          }
        )
      }
    },
    
    onUpdate(id, column) {
      columns.updateCards(id, column)
      .then(
        ()=>
        {
          columns.getAll().then(response=>
          (this.columns=response.data))  
        }
      )
    }

  }

}

</script>

<style>
  body {
    background-color: lightblue;
  }
  
  .board {
    width:340px;
	  borders: 1px solid black;
	  text-align:center;
	  background-color:blue;
	  display:inline-block;
	  vertical-align:top;
	  margin-right: 10px;
    padding:10px;
  }
  
  form {
    margin-left:10px;
    margin-right:10px;
    padding-bottom:10px;
    padding-top:10px;
  }
  
  .kanbon-card {
	  background-color:lightgray;
	  margin-left:10px;
	  margin-right:10px;
	  vertical-align:middle;
    padding-bottom:20px;
    padding-top:20px;
    margin-bottom:10px;
  }
  
  .dragArea {
    min-height:20px;
  }
   
  .card-number {
    vertical-align:middle;
  }

</style>