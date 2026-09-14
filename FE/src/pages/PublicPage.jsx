import useBooking from '../hooks/useBooking';
import BookingView from '../views/BookingView';

function PublicPage() {
  const booking = useBooking();
  return <BookingView {...booking} />;
}

export default PublicPage;
