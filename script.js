/**
 * This script is based on Tania Rascia's CRUD todo app found here:
 * https://github.com/taniarascia/mvc
 */

/**
 * @class Model
 *
 * Manages the data of the application.
 *
 * Only deals with the actual data, and modifying that data. It doesn't
 * understand or have any knowledge the input - what's modifying it, or the
 * output - what will end up displaying.
 *
 * Gives everything you need for a fully functioning CRUD app, if you manually
 * type all actions through the console, and view the output in the console.
 */

class Model {
  constructor() {
    // The state of the model, an array of recipe objects,
    // prepopulated with some data
    this.recipes = [
      {
        id: 1,
        ingredients: ['chilli', 'garlic', 'rice'],
        method: 'fry chilli and garlic in pan, cook rice in water',
        time: '15',
      },
      {
        id: 2,
        ingredients: ['banana', 'custard', 'cinnamon'],
        method: 'slice bananas, warm custard, and sprinkle cinnamon',
        time: '7',
      },
    ]
  }

  bindRecipesChanged(callback) {
    this.onRecipesChanged = callback
  }

  // here is logic for adding a new recipe into our "Model" database - the part
  // that handles our data
  addRecipe(recipeIngredients, recipeMethod) {
    // arrays use index notation, meaning the first item in an array has an
    // index of 0, so this variable captures the last item in the array.
    const lastRecipe = this.recipes.length - 1
    const recipe = {
      id: this.recipes.length > 0 ? this.recipes[lastRecipe].id + 1 : 1,
      ingredients: recipeIngredients.split(','),
      method: recipeMethod,
    }
    // add the new recipe onto the existing array of recipe object(s)
    this.recipes.push(recipe)
    this.onRecipesChanged(this.recipes)
    // console.log(ingredients)
  }

  // Map through all recipes, and replace the ingredients of recipe with the
  // specified id
  editIngredients(id, updatedIngredients) {
    this.recipes = this.recipes.map(recipe =>
      recipe.id === id
        ? { id: recipe.id, ingredients: updatedIngredients }
        : recipe
    )
  }

  // Map through all recipes, and replace the method of recipe with the
  // specified id
  editMethod(id, updatedMethod) {
    this.recipes = this.recipes.map(recipe =>
      recipe.id === id ? { id: recipe.id, method: updatedMethod } : recipe
    )
  }

  // Use the filter method to filter a recipe out of the recipes array by
  // targeting its id, so we can delete it
  deleteRecipe(id) {
    this.recipes = this.recipes.filter(recipe => recipe.id !== id)
  }
}

/**
 * @class View
 *
 * Visual representation of the model.
 *
 * Creates the view by manipulating the DOM:
 * https://www.taniarascia.com/introduction-to-the-dom/
 */
class View {
  constructor() {
    this.app = this.getElement('#root')

    // The title of the app
    this.title = this.createElement('h1')
    this.title.textContent = 'Recipes' + ' ' + '\ud83e\udd66'

    // The recipe form, with a [type="text"] input, and a submit button
    this.form = this.createElement('form')
    this.form.method = 'post'

    this.ingredientTextarea = this.createElement('textarea')
    this.ingredientTextarea.name = 'ingredients'
    this.ingredientTextarea.id = 'ingredients'
    this.ingredientTextarea.placeholder = 'Add ingredients (comma-separated)'
    this.ingredientTextarea.name = 'ingredients'
    this.ingredientTextarea.required = 'true'

    this.ingredientLabel = this.createElement('label')
    this.ingredientLabel.setAttribute('for', 'ingredients')

    this.ingredientLabel.append(this.ingredientTextarea)

    this.methodTextarea = this.createElement('textarea')
    this.methodTextarea.name = 'method'
    this.methodTextarea.id = 'method'
    this.methodTextarea.placeholder = 'Add method'
    this.methodTextarea.name = 'method'
    this.methodTextarea.required = 'true'

    this.methodLabel = this.createElement('label')
    this.methodLabel.setAttribute('for', 'method')

    this.methodLabel.append(this.methodTextarea)

    this.submitButton = this.createElement('button', 'recipe_button')
    this.submitButton.textContent = 'Submit'
    this.submitButton.type = 'submit'

    // The visual representation of the recipes
    this.allRecipes = this.createElement('div', 'all-recipes')

    // Append the inputs and submit button to the form
    this.form.append(this.ingredientLabel, this.methodLabel, this.submitButton)

    // Append the title, form, and recipes to the app
    this.app.append(this.title, this.form, this.allRecipes)
  }
  // Create an element with an optional CSS class
  createElement(tag, className) {
    const element = document.createElement(tag)
    if (className) element.classList.add(className)

    return element
  }
  // Retrieve an element from the DOM
  getElement(selector) {
    const element = document.querySelector(selector)

    return element
  }

  // For resetting all the text (unsure yet if needed)
  get _ingredientText() {
    return this.ingredientTextarea.value
  }

  get _methodText() {
    return this.methodTextarea.value
  }

  _resetIngredientTextarea() {
    this.ingredientTextarea.value = ''
  }

  _resetMethodTextarea() {
    this.methodTextarea.value = ''
  }

  // The displayRecipes method will create the elements that the recipes consist
  // of, and display them. Every time a recipe is changed, added, or removed,
  // the displayRecipes method will be called again with the recipes from the
  // model, resetting the recipes and redisplaying them. This will keep the view
  // in sync with the model state.
  displayRecipes(recipes) {
    // Delete all nodes
    while (this.allRecipes.firstChild) {
      this.allRecipes.removeChild(this.allRecipes.firstChild)
    }

    // Show default message when there are no recipes
    if (recipes.length === 0) {
      const paragraph = this.createElement('p')
      paragraph.textContent = "Wanna get cookin'? Add a recipe!"
      this.allRecipes.append(paragraph)
    } else {
      recipes.forEach(recipe => {
        const recipeBlock = this.createElement('div', 'recipe-block')
        const ingredientWrapper = this.createElement('ul')
        const methodWrapper = this.createElement('p', 'method')

        const methodText = this.createElement('span')
        // The method text will be content-editable
        methodText.contentEditable = true
        methodText.classList.add('editable')
        methodText.textContent = recipe.method

        methodWrapper.append(methodText)

        console.log(recipe.ingredients)

        recipe.ingredients.forEach(ingredient => {
          const li = this.createElement('li')

          // The ingredient item text will be in a content-editable span
          const ingredientText = this.createElement('span')
          ingredientText.contentEditable = true
          ingredientText.classList.add('editable')
          ingredientText.textContent = ingredient

          li.append(ingredientText)
          ingredientWrapper.append(li)
        })

        recipeBlock.append(ingredientWrapper, methodWrapper)
        this.allRecipes.append(recipeBlock)
      })
    }
  }

  bindAddRecipe(handler) {
    this.form.addEventListener('submit', event => {
      event.preventDefault()

      if (this._ingredientText || this._methodText) {
        handler(this._ingredientText, this._methodText)
        this._resetIngredientTextarea()
        this._resetMethodTextarea()
      }
    })
  }
}

/**
 * @class Controller
 *
 * Links the user input and the view output.
 *
 * @param model
 * @param view
 */
class Controller {
  constructor(model, view) {
    this.model = model
    this.view = view

    this.model.bindRecipesChanged(this.onRecipesChanged)

    // Display initial recipes
    this.onRecipesChanged(this.model.recipes)
    this.view.bindAddRecipe(this.handleAddRecipe)
  }

  onRecipesChanged = recipes => {
    this.view.displayRecipes(recipes)
  }

  handleAddRecipe = (recipeIngredients, recipeMethod) => {
    this.model.addRecipe(recipeIngredients, recipeMethod)
  }

  // handleEditIngredients = (id, updatedIngredients) => {
  //   this.model.editIngredients(id, updatedIngredients)
  // }

  // handleEditMethod = (id, updatedMethod) => {
  //   this.model.editMethod(id, updatedMethod)
  // }
}

const app = new Controller(new Model(), new View()) // eslint-disable-line no-unused-vars
