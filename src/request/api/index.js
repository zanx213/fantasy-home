const files = import.meta.globEager('./*.js')
const modules = {}

for (const key in files) {
  if (Object.hasOwnProperty.call(files, key)) {
    modules[key.replace(/(\.\/|\.js)/g, '')] = files[key].default
  }
}

export default modules