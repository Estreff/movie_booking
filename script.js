const container = document.querySelector('.container');
const seats = document.querySelectorAll('.row .seat');
const book = document.getElementById('book_seats');
const count = document.getElementById('count');
const total = document.getElementById('total');
const movieSelect = document.getElementById('movie');


// Populate UI
disableSeats();
  

// Update total and count
function updateSelectedCount() {
  const selectedSeats = document.querySelectorAll('.row .seat.selected');
  const ticketPrice = +movieSelect.value;
  const seatsIndex = [...selectedSeats].map(seat => [...seats].indexOf(seat));
  const selectedSeatsCount = selectedSeats.length;

  count.innerText = selectedSeatsCount;
  total.innerText = selectedSeatsCount * ticketPrice;
}

// Update total booked
function updateBookedCount() {
  const selectedSeats = document.querySelectorAll('.row .seat.selected');
  // const seatsIndex = [...selectedSeats].map(seat => [...seats].indexOf(seat));
  // const bookedSeats = document.querySelectorAll('.row .seat.occupied');
  // const occupiedIndex = [...bookedSeats].map(seat => [...seats].indexOf(seat));
  selectedSeats.forEach(seat => {
    seat.classList.add('occupied');
    seat.classList.remove('selected');
  })
  updateSelectedCount();
  
  setMovieData(getMovieIndex(), getTicketPrice(), getOccupiedSeats(), getSelectedSeats());
}

function selectMovie(menu) {
  const selectedMovie = menu.options[menu.selectedIndex].getAttribute('data-movie');
  const selectedMoviePrice = menu.options[menu.selectedIndex].value;

  const getMovie = JSON.parse(localStorage.getItem(`${selectedMovie}`));
  if(selectedMovie == 0) {
    disableSeats();
    
  } else if(getMovie !== null) {
    const reserved = getMovie.reservedSeats;
    const occupied = getMovie.occupiedSeats;
    clearSeats();
    
    seats.forEach((seat, index) => {
      if(reserved && reserved.indexOf(index) > -1) {
        seat.classList.add('selected');
      }
      if(occupied.indexOf(index) > -1) {
        seat.classList.add('occupied');
      }
      updateSelectedCount();
    })
  }  else {
    clearSeats();

  }
}


// Seat click event
container.addEventListener('click', e => {
  if(
    e.target.classList.contains('seat') &&
    !e.target.classList.contains('occupied')
    ) {
      e.target.classList.toggle('selected');
      setMovieData(getMovieIndex(), getTicketPrice(), getOccupiedSeats(), getSelectedSeats());
      updateSelectedCount();
  }
})

// Book the seats
book.addEventListener('click', e => {
  updateBookedCount();
})

// Get Movie Index
function getMovieIndex() {
  return movieSelect.options[movieSelect.selectedIndex].getAttribute('data-movie');
}

// Get Ticket Price
function getTicketPrice() {
  return movieSelect.value;
}

// Clear seating
function clearSeats() {
  return seats.forEach(seat => {
    seat.classList.remove('occupied');
    seat.classList.remove('selected');
    seat.classList.remove('disabled');
  })
  updateSelectedCount();
}

function disableSeats() {
  return seats.forEach(seat => {
    seat.classList.remove('occupied');
    seat.classList.remove('selected');
    seat.classList.add('disabled');
  })
}

function getSelectedSeats() {
  const selectedSeats = document.querySelectorAll('.row .seat.selected');
  return [...selectedSeats].map(seat => [...seats].indexOf(seat));
}

function getOccupiedSeats() {
  const bookedSeats = document.querySelectorAll('.row .seat.occupied');
  return [...bookedSeats].map(seat => [...seats].indexOf(seat));
}

// Save selected movie index and price
function setMovieData(movieIndex, ticketPrice, occupiedSeats, selectedSeats) {
  const movieStorage = {
    movieIndex: movieIndex,
    ticketPrice: ticketPrice,
    occupiedSeats: occupiedSeats,
    reservedSeats: selectedSeats
  }
  localStorage.setItem(`${movieIndex}`, JSON.stringify(movieStorage));
}

function resetMovie() {
  seats.forEach(seat => {
    seat.classList.remove('occupied');
    seat.classList.remove('selected');
  })

  setMovieData(getMovieIndex(), getTicketPrice(), [], []);
}