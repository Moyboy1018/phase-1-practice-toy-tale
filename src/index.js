let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const toyCollection = document.getElementById('toy-collection');
  const toyForm = document.querySelector('.add-toy-form');

  // Fetch all toys and display them on page load
  fetch('http://localhost:3000/toys')
    .then(response => response.json())
    .then(toys => {
      toys.forEach(toy => renderToyCard(toy));
    });

  // Function to render a single toy card
  function renderToyCard(toy) {
    const card = document.createElement('div');
    card.className = 'card';

    const toyName = document.createElement('h2');
    toyName.textContent = toy.name;

    const toyImage = document.createElement('img');
    toyImage.src = toy.image;
    toyImage.className = 'toy-avatar';

    const toyLikes = document.createElement('p');
    toyLikes.textContent = `${toy.likes} Likes`;

    const likeButton = document.createElement('button');
    likeButton.className = 'like-btn';
    likeButton.id = toy.id;
    likeButton.textContent = 'Like ❤️';

    // Add event listener to increase likes when button is clicked
    likeButton.addEventListener('click', () => increaseLikes(toy, toyLikes));

    // Append all elements to the card, then add card to the toy collection
    card.append(toyName, toyImage, toyLikes, likeButton);
    toyCollection.appendChild(card);
  }

  // Handle form submission to add a new toy
  toyForm.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const newToy = {
      name: event.target.name.value,
      image: event.target.image.value,
      likes: 0
    };

    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(newToy)
    })
    .then(response => response.json())
    .then(toy => {
      renderToyCard(toy); // Add the new toy to the DOM
      toyForm.reset(); // Reset the form after submission
    });
  });

  // Function to increase likes for a specific toy
  function increaseLikes(toy, toyLikesElement) {
    const newLikes = toy.likes + 1;
    
    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ likes: newLikes })
    })
    .then(response => response.json())
    .then(updatedToy => {
      toy.likes = updatedToy.likes; // Update the toy object with new likes
      toyLikesElement.textContent = `${updatedToy.likes} Likes`; // Update likes in the DOM
    });
  }
});
