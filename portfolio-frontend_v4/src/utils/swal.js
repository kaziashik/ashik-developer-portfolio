let swalPromise

export async function getSwal() {
  if (!swalPromise) {
    swalPromise = import('sweetalert2').then((module) => module.default)
  }
  return swalPromise
}
