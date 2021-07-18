let showSoldItems = false
hideModal()
start()

async function start() {
    await loadProducts()
    listenForBooking()
    listenForCopyingLink()
    listenForTogglingSoldItems()
}

function copyLink() {
    document.getElementById('link-input').select()
    document.execCommand('copy')
    alert('The link was copied in your clipboard')
    hideModal()
}

function countTotalSoldPerSection(section) {
    let total = 0

    section.products.forEach((product) => {
        if (product.sold) {
            total++
        }
    })

    return total
}

function displayContactDetails() {
    document.getElementById('modal-content').innerHTML = renderContactDetails()
}

function displayLinktDetails(id) {
    document.getElementById('modal-content').innerHTML = renderLinkDetails(id)
}

function displayMenu(section) {
    document.getElementById(
        'nav'
    ).innerHTML += `<a href="#${section.id}" class="navigation-button text-sm md:text-base lg:text-lg font-medium text-gray-200 hover:text-white text-center p-2 sm:px-4 lg:px-6 py-2">
		 	${section.title}
        </a>`
}

function displayProducts(section) {
    let html = ''

    section.products
        .sort((value) => (value.sold ? -1 : 1))
        .forEach((furniture) => {
            html += render(furniture)
        })

    document.getElementById(section.id + '-products').innerHTML = html
}

function displaySection(section, totalSold, totalItems) {
    let showButtonToggleSoldItems = `        <div class="flex flex-col items-end">
          <div class="text-lg flex items-center text-gray-500">
            <span class="inline mr-1">${totalSold}</span>
            <span class="">on</span>
            <span class="ml-1 inline">${totalItems} items sold</span>
          </div>
          <button class="text-indigo-500 hover:text-indigo-800 text-xs hide-sold-items">Show <span class="total-sold"></span> sold items</button>
        </div>`

    let html = `<div
    class="container mx-auto px-4 flex pt-24 relative"
    style="max-width: 1200px"
    id="${section.id}"
  >
  	<div class="w-full">
      <div class="block md:flex items-baseline justify-between -mb-12">
        <h2 class="block w-full md:flex-1 text-left text-6xl font-thin text-indigo-700 ">
          ${section.title}
        </h2>
          ${showButtonToggleSoldItems}
	    </div>
      
    	<div class="w-full flex-1" id="${section.id}-products"></div>`

    html += ` </div></div><hr class="mt-24 mb-6">`

    document.getElementById('app').innerHTML += html
}

function find(id) {
    let needle = null
    data.forEach((section) => {
        section.products.forEach((product) => {
            if (product.ref == id) {
                needle = product
            }
        })
    })

    return needle
}

function hideModal() {
    document.getElementById('modal').style.display = 'none'
}

function listenForBooking() {
    let elts = document.querySelectorAll('.book-button')
    for (let element of elts) {
        element.addEventListener('click', (e) => {
            e.preventDefault()
            displayContactDetails()
            showModal()
        })
    }
}

function listenForCopyingLink() {
    let elts = document.querySelectorAll('.get-link-button')

    for (let element of elts) {
        element.addEventListener('click', (e) => {
            e.preventDefault()

            let id = element.getAttribute('data-ref')
            displayLinktDetails(id)
            showModal()
            document
                .getElementById('copy-link-button')
                .addEventListener('click', copyLink)
        })
    }
}

function listenForModalClose() {
    let elts = document.querySelectorAll('.close-modal')
    for (let element of elts) {
        element.addEventListener('click', hideModal)
    }
}

function listenForTogglingSoldItems() {
    let buttons = document.querySelectorAll('.hide-sold-items')
    for (let button of buttons) {
        button.addEventListener('click', function () {
            let elements = document.querySelectorAll('.has-been-sold')
            for (let element of elements) {
                if (showSoldItems) {
                    element.style.display = 'none'
                } else {
                    element.style.display = 'block'
                }
            }
            if (showSoldItems) {
                showSoldItems = false
            } else {
                showSoldItems = true
            }
            updateTextOfSoldItemsButton()
        })
    }
}

function loadProducts() {
    return new Promise((resolve, reject) => {
        data.forEach((section) => {
            displayMenu(section)
            let totalSold = countTotalSoldPerSection(section)
            let totalItems = section.products.length
            displaySection(section, totalSold, totalItems)
            displayProducts(section)
            resolve()
        })
    })
}

function render(furniture) {
    let html = ''
    let details = furniture.details
    let prepend = ''
    let copyButton = `<a href="#" target= "_blank" data-ref="${furniture.ref}" class="get-link-button relative inline-flex items-center px-4 py-2 border bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 hover:border-gray-700">Copy link</a>`
    if (furniture.providerUrl.length > 0) {
        details +=
            ' | <a href="' +
            furniture.providerUrl +
            '" target="_blank" class="text-indigo-700 hover:underline" title="Visit provider website">Official Link</a>'
    }

    if (furniture.sold) {
        prepend = `<div class="absolute h-full w-full z-20 top-0 bg-indigo-300 text-6xl sm:text-7xl md:text-8xl lg:text-9xl rounded-lg text-white text-shadow flex justify-center items-center bg-opacity-20">
		SOLD
	</div>`
    }

    html += `
  	<div class="pt-12 ${furniture.sold ? 'has-been-sold' : ''}" id="${
        furniture.ref
    }">
		<div class="relative mt-12">
			${prepend}
			<div class="block lg:flex rounded bg-white ${
                furniture.sold ? 'opacity-50' : ''
            }">
				<img src="images/${
                    furniture.defaultImage.length > 0
                        ? furniture.defaultImage
                        : 'Hero.jpg'
                }" class="object-cover w-full lg:w-96 rounded-t-lg lg:rounded-l-lg lg:rounded-tr-none" style="max-height: 500px"/>
				<div class="px-6 sm:px-8 md:px-10 lg:px-12 py-6 rounded-b-lg lg:rounded-r-lg flex flex-col w-full">
					<div class="block sm:flex items-center justify-between w-full mb-8">
						<div class="flex-1 text-gray-700 text-3xl">${furniture.name}</div>
						<div class="block text-indigo-600 text-3xl">${furniture.price}</div>
					</div>
					<div class="block sm:flex items-center w-full mb-4 sm:mb-2">
						<div class="w-32 mr-4 text-gray-500">Reference</div>
						<div class="flex-1">${furniture.ref}</div>
					</div>
					<div class="block sm:flex items-center w-full mb-4 sm:mb-2">
						<div class="w-32 mr-4 text-gray-500">Brand</div>
						<div class="flex-1">${furniture.brand}</div>
					</div>
					<div class="block sm:flex items-center w-full mb-4 sm:mb-2">
						<div class="w-32 mr-4 text-gray-500">Date purchased</div>
						<div class="flex-1">${furniture.datePurchased}</div>
					</div>
					<div class="block sm:flex items-center w-full mb-4 sm:mb-2">
						<div class="w-32 mr-4 text-gray-500">Brand new price</div>
						<div class="flex-1">${furniture.brandNewPrice}</div>
					</div>
					<div class="block sm:flex items-center w-full mb-4 sm:mb-2">
						<div class="w-32 mr-4 text-gray-500">Price</div>
						<div class="flex-1">${furniture.price}</div>
					</div>`

    if (furniture.details.length > 0) {
        html += `<div class="block sm:flex items-center w-full mb-4 sm:mb-2">
						<div class="w-32 mr-4 text-gray-500">Details</div>
						<div class="flex-1">${details}</div>
					</div>`
    }

    html += `<div class="mt-8 relative z-0 inline-flex rounded-md">
						<a href="#book" type="button" class="book-button relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 border-indigo-600 bg-indigo-600 text-sm font-medium text-gray-100 hover:bg-indigo-700 hover:bg-gray-700 hover:text-white bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 hover:bg-indigo-800 hover:text-white">
							Book now
						</a>
            ${copyButton}
						<a href="${furniture.galleryUrl}" target= "_blank" class="gallery-button relative inline-flex items-center px-4 py-2 rounded-r-md border bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 hover:border-gray-700">
							View photo gallery
						</a>
          </div>
				</div>
			</div>
		</div>
	</div>
	`

    return html
}

function showModal() {
    document.getElementById('modal').style.display = 'block'
    window.setTimeout(() => {
        listenForModalClose()
    }, 500)
}

function renderContactDetails() {
    return `
    <div class="bg-white p-4 sm:p-6 md:p-8">
      <div class="flex items-center justify-between mt-3 mb-8">
        <h3 class=" text-2xl sm:text-4xl leading-10 font-medium text-gray-900">
          1st come, 1st served!
        </h3>
        <button type="button" class=" close-modal border rounded-full text-gray-900 h-10 w-10 text-xl text-gray-500 flex items-center justify-center">
          x
        </button>
      </div>
      <div class="mb-4 text-lg bg-indigo-50 p-4 rounded">
        <div class="block sm:flex items-start mb-3">
          <div class="text-gray-500 mr-3 w-32">Sales on</div>
          <div class="text-gray-800">Saturday 10/07/2021</div>
        </div>
        <div class="block sm:flex items-start mb-3">
          <div class="text-gray-500 mr-3 w-32">Hours</div>
          <div class="text-gray-800">9am > 4pm</div>
        </div>
        <div class="block sm:flex items-start mb-3">
          <div class="text-gray-500 mr-3 w-32">Location</div>
          <div class="text-gray-800">Lees Street, Curepipe</div>
        </div>
        <div class="block sm:flex items-start mb-3">
          <div class="text-gray-500 mr-3 w-32">No bookings</div>
          <div class="text-gray-800">Except against payment</div>
        </div>
        <div class="block sm:flex items-start mb-2">
          <div class="text-gray-500 mr-3 w-32">MCB Account</div>
          <div class="text-gray-800">000023731893</div>
        </div>
      </div>

      <div class="block sm:flex justify-between items-center py-3">
        <div class="sm:flex">
          <a
            href="tel:+23054235136"
            type="button"
            target="_blank"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 my-1 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto mx-0 sm:text-sm">
            Call on 54 23 51 36
          </a>
          <a
            href="https://wa.me/+23054235136"
            target="_blank"
            type="button"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 my-1 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto mx-0 sm:ml-4 sm:text-sm">
            WhatsApp
          </a>
        </div>
        <button type="button" class="w-full sm:flex-1 justify-center sm:justify-end close-modal text-indigo-500 hover:text-indigo-800 text-sm text-gray-500 flex items-center">
          Close
        </button>
      </div>
    </div>`
}

function renderLinkDetails(id) {
    let product = find(id)

    return `
    <div class="bg-white p-4 sm:p-6 md:p-8">
      <div class="flex items-center justify-between mt-3 mb-8">
        <h3 class=" text-2xl sm:text-4xl leading-10 font-medium text-gray-900">
          Copy link
        </h3>
        <button type="button" class=" close-modal border rounded-full text-gray-900 h-10 w-10 text-xl text-gray-500 flex items-center justify-center">
          x
        </button>
      </div>
      <div class="mb-4 text-lg rounded">
        <p >The link below will point directly to <strong>"${product.name}"</strong>, just click on the button "Copy Link".</p>
        <input type="text" name="link" value="https://sales.davidgaillard.com/#${product.ref}" id="link-input"
          style="border: unset; shadow; unset; width: 100%; margin-top: 20px; color: rgb(79,70,229);"
        >

      </div>

      <div class="block sm:flex justify-between items-center py-3">
        <div class="sm:flex">
          <button
            id="copy-link-button"
            type="button"
            target="_blank"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 my-1 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto mx-0 sm:text-sm">
            Copy link
          </button>
        </div>
        <button type="button" class="w-full sm:flex-1 justify-center sm:justify-end close-modal text-indigo-500 hover:text-indigo-800 text-sm text-gray-500 flex items-center">
          Close
        </button>
      </div>
    </div>`
}

function updateTextOfSoldItemsButton() {
    let buttons = document.querySelectorAll('.hide-sold-items')
    for (let button of buttons) {
        if (showSoldItems) {
            button.innerText = `Hide sold items`
        } else {
            button.innerText = `Show sold items`
        }
    }
}
