const container = document.querySelector('.container');
const allSeats = document.querySelectorAll('.row .seat');
const seats = document.querySelectorAll('.row .seat:not(.occupied)');
const book = document.getElementById('book_seats');
const count = document.getElementById('count');
const total = document.getElementById('total');
const movieSelect = document.getElementById('movie');
const movieIndex = document.getElementById('movie').selectedIndex;

populateUI();

let ticketPrice = +movieSelect.value;
console.log('Ticket Price: ', ticketPrice);

// Save selected movie index and price
function setMovieData(movieIndex, ticketPrice, movieSeats) {
  const movieStorage = {
    movieIndex: movieIndex,
    ticketPrice: ticketPrice,
    occupiedSeats: movieSeats
  }
  console.log(movieIndex);
  localStorage.setItem(`${movieIndex}`, JSON.stringify(movieStorage));
}

// Update total and count
function updateSelectedCount() {
  const selectedSeats = document.querySelectorAll('.row .seat.selected');

  const seatsIndex = [...selectedSeats].map(seat => [...seats].indexOf(seat));

  localStorage.setItem('selectedSeats', JSON.stringify(seatsIndex));
  
  const selectedSeatsCount = selectedSeats.length;

  console.log('Movie Price: ', ticketPrice);

  count.innerText = selectedSeatsCount;
  total.innerText = selectedSeatsCount * ticketPrice;
}

// Update total booked
function updateBookedCount() {
  const bookedSeats = document.querySelectorAll('.row .seat.selected');

  bookedSeats.forEach(seat => {
    seat.classList.add('occupied');
    seat.classList.remove('selected');
  })
  updateSelectedCount();

  const seatsIndex = [...bookedSeats].map(seat => [...seats].indexOf(seat));
  console.log(movieIndex, ticketPrice, seatsIndex);

  setMovieData(movieIndex, ticketPrice, seatsIndex);
}

// Get data from localstorage and populate UI
function populateUI() {
  const selectedSeats = JSON.parse(localStorage.getItem('selectedSeats'));

  if(selectedSeats !== null && selectedSeats.length > 0) {
    seats.forEach((seat, index) => {
      if(selectedSeats.indexOf(index) > -1) {
        seat.classList.add('selected');
      }
    });
  }

  const selectedMovieIndex = localStorage.getItem('selectedMovieIndex');
  
  if(selectedMovieIndex !== null) {
    movieSelect.selectedIndex  = selectedMovieIndex;
  }
}

// Movie select event
// movieSelect.addEventListener('change', e => {
//   console.log('Movie Index: ', e.target.dataset.movieIndex);
//   if (e.target.value == 0) {
//     allSeats.forEach(seat => {
//       seat.classList.remove('occupied');
//       seat.classList.remove('selected');
//       seat.classList.add('disabled');
//     })
//   } else {
//     allSeats.forEach(seat => {
//       seat.classList.remove('disabled');
//     })
//   }

//   ticketPrice = +e.target.value;
//   // setMovieData(e.target.selectedIndex, e.target.value);
//   updateSelectedCount();
// })

function selectMovie(menu) {
  const selectedMovie = parseInt(menu.options[menu.selectedIndex].getAttribute('data-movie'));
  const selectedMoviePrice = menu.options[menu.selectedIndex].value;

  console.log('Selected Movie: ', selectedMovie);

  const getMovie = localStorage.getItem(`${selectedMovie}`);
  if(selectedMovie === 0) {
    console.log('Select Movie');
    allSeats.forEach(seat => {
      seat.classList.remove('occupied');
      seat.classList.remove('selected');
      seat.classList.add('disabled');
    })
  } else if(getMovie !== null) {
    allSeats.forEach(seat => {
      seat.classList.remove('disabled');
    })

    const occupied = getMovie.occupiedSeats;
    const movieInfo = {
      movieIndex: selectedMovie,
      moviePrice: selectedMoviePrice
    }
  
    console.log('Movie Info: ', movieInfo);
  }  else {
    console.log(`This movie doesn't have info`);
  }
}


// Seat click event
container.addEventListener('click', e => {
  if(
    e.target.classList.contains('seat') &&
    !e.target.classList.contains('occupied')
    ) {
      e.target.classList.toggle('selected');
      updateSelectedCount();
  }
})

// Book the seats
book.addEventListener('click', e => {
  updateBookedCount();
})

// Initial count and total set
updateSelectedCount();