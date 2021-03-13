export default function(error) {
  if (error.response && error.response.getData()) {
    return error.response.getData();
  } else {
    return error.message;
  }
}
