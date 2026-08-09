let swalPromise

export async function getSwal() {
  if (!swalPromise) {
    swalPromise = import('sweetalert2').then((module) => module.default)
  }
  return swalPromise
}

/** Short toast for admin CRUD success/error (non-blocking). */
export async function toastSuccess(title) {
  const Swal = await getSwal()
  return Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'success',
    title,
    showConfirmButton: false,
    timer: 1800,
    timerProgressBar: true,
  })
}

export async function toastError(title, text = '') {
  const Swal = await getSwal()
  return Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'error',
    title,
    text: text || undefined,
    showConfirmButton: false,
    timer: 2800,
    timerProgressBar: true,
  })
}

export async function confirmDelete(title, text = 'This cannot be undone.') {
  const Swal = await getSwal()
  return Swal.fire({
    icon: 'warning',
    title,
    text,
    showCancelButton: true,
    confirmButtonText: 'Delete',
    confirmButtonColor: '#dc2626',
  })
}

/** MongoDB ObjectId (24 hex chars). Static showcase slugs like "zapshift" fail this. */
export function isPersistedId(id) {
  return typeof id === 'string' && /^[a-f\d]{24}$/i.test(id)
}
