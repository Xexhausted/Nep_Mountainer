/* 
    NepMountainer Resort - Global Scripts
    Vanilla JavaScript
*/

document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Header Logic
    const header = document.querySelector('.header');
    
    const handleScroll = () => {
        const isHomePage = window.location.pathname === '/' || 
                           window.location.pathname.endsWith('index.html') || 
                           window.location.pathname === '';
        
        if (isHomePage) {
            header.classList.toggle('scrolled', window.scrollY > 50);
        } else {
            header.classList.add('scrolled');
        }
    };

    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => {
                handleScroll();
                scrollTimeout = null;
            }, 10);
        }
    });
    handleScroll(); // Initial check

    // 2. Mobile Menu Logic
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const overlay = document.querySelector('.overlay');

    if (mobileToggle && mobileMenu && overlay) {
        const toggleMenu = () => {
            mobileMenu.classList.toggle('active');
            overlay.classList.toggle('active');
            
            // Toggle icon between ☰ and ✕
            if (mobileMenu.classList.contains('active')) {
                mobileToggle.textContent = '✕';
                document.body.style.overflow = 'hidden'; // Prevent scroll
            } else {
                mobileToggle.textContent = '☰';
                document.body.style.overflow = 'auto'; // Enable scroll
            }
        };

        mobileToggle.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', toggleMenu);

        // Close menu when clicking links
        const menuLinks = mobileMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', toggleMenu);
        });
    }

    // 3. Booking Form Logic
    const bookingForm = document.getElementById('booking-form');
    const successMessage = document.getElementById('success-message');

    if (bookingForm) {
        // Form Inputs
        const fullName = document.getElementById('full-name');
        const email = document.getElementById('email');
        const phone = document.getElementById('phone');
        const roomType = document.getElementById('room-type');
        const checkIn = document.getElementById('check-in');
        const checkOut = document.getElementById('check-out');
        const guests = document.getElementById('guests');
        const address = document.getElementById('address');

        // Error Spans
        const errorFullName = document.getElementById('error-full-name');
        const errorEmail = document.getElementById('error-email');
        const errorPhone = document.getElementById('error-phone');
        const errorRoomType = document.getElementById('error-room-type');
        const errorCheckIn = document.getElementById('error-check-in');
        const errorCheckOut = document.getElementById('error-check-out');
        const errorGuests = document.getElementById('error-guests');
        const errorAddress = document.getElementById('error-address');

        // Helper: Show Error
        const showError = (input, errorSpan, message) => {
            if (input) input.classList.add('invalid');
            if (errorSpan) errorSpan.textContent = message;
        };

        // Helper: Clear Error
        const clearError = (input, errorSpan) => {
            if (input) input.classList.remove('invalid');
            if (errorSpan) errorSpan.textContent = '';
        };

        // Helper: Validate Email
        const isValidEmail = (emailValue) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(emailValue);
        };

        // Helper: Validate Phone
        const isValidPhone = (phoneValue) => {
            const phoneRegex = /^[0-9]{10,}$/;
            return phoneRegex.test(phoneValue);
        };

        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isValid = true;

            // Full Name
            if (fullName.value.trim() === '') {
                showError(fullName, errorFullName, 'Full name is required.');
                isValid = false;
            } else {
                clearError(fullName, errorFullName);
            }

            // Email
            if (email.value.trim() === '') {
                showError(email, errorEmail, 'Email address is required.');
                isValid = false;
            } else if (!isValidEmail(email.value.trim())) {
                showError(email, errorEmail, 'Please enter a valid email address.');
                isValid = false;
            } else {
                clearError(email, errorEmail);
            }

            // Phone
            if (phone.value.trim() === '') {
                showError(phone, errorPhone, 'Phone number is required.');
                isValid = false;
            } else if (!isValidPhone(phone.value.trim())) {
                showError(phone, errorPhone, 'Phone number must be at least 10 digits.');
                isValid = false;
            } else {
                clearError(phone, errorPhone);
            }

            // Room Type
            if (roomType.value === '') {
                showError(roomType, errorRoomType, 'Please select a room type.');
                isValid = false;
            } else {
                clearError(roomType, errorRoomType);
            }

            // Dates
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const checkInDate = new Date(checkIn.value);
            const checkOutDate = new Date(checkOut.value);

            if (checkIn.value === '') {
                showError(checkIn, errorCheckIn, 'Check-in date is required.');
                isValid = false;
            } else if (checkInDate < today) {
                showError(checkIn, errorCheckIn, 'Check-in date cannot be in the past.');
                isValid = false;
            } else {
                clearError(checkIn, errorCheckIn);
            }

            if (checkOut.value === '') {
                showError(checkOut, errorCheckOut, 'Check-out date is required.');
                isValid = false;
            } else if (checkOutDate <= checkInDate) {
                showError(checkOut, errorCheckOut, 'Check-out must be after check-in.');
                isValid = false;
            } else {
                clearError(checkOut, errorCheckOut);
            }

            // Guests
            if (guests.value < 1) {
                showError(guests, errorGuests, 'At least 1 guest is required.');
                isValid = false;
            } else {
                clearError(guests, errorGuests);
            }

            // Address
            if (address && address.value.trim() === '') {
                showError(address, errorAddress, 'Address is required.');
                isValid = false;
            } else if (address) {
                clearError(address, errorAddress);
            }

            if (isValid) {
                const submitBtn = bookingForm.querySelector('.btn-submit');
                const originalBtnText = submitBtn.textContent;
                const specialRequests = document.getElementById('special-requests');
                
                // Show loading state
                submitBtn.disabled = true;
                submitBtn.textContent = 'Processing...';

                // GOOGLE FORM CONFIGURATION
                const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSeb0ZvJPSqz7fHRGUshFQcPztUOyhvHsZ1JtvAqdLmRDKnZvw/formResponse';

                // 2. ENTRY IDs (Extracted from your Google Form)
                const ENTRY_IDS = {
                    fullName: 'entry.2005620554',
                    email: 'entry.1045781291',
                    phone: 'entry.1159606968',
                    address: 'entry.1065046570',
                    roomType: 'entry.839337160',
                    checkIn: 'entry.1272094860',
                    checkOut: 'entry.669758729',
                    guests: 'entry.1332151749',
                    specialRequests: 'entry.606721498'
                };

                // Create a hidden iframe to handle the submission without redirecting the user
                let iframe = document.getElementById('hidden_iframe');
                if (!iframe) {
                    iframe = document.createElement('iframe');
                    iframe.id = 'hidden_iframe';
                    iframe.name = 'hidden_iframe';
                    iframe.style.display = 'none';
                    document.body.appendChild(iframe);
                }

                // Create a temporary form to submit to the iframe
                const tempForm = document.createElement('form');
                tempForm.action = GOOGLE_FORM_URL;
                tempForm.method = 'POST';
                tempForm.target = 'hidden_iframe';

                // Helper to add hidden fields to the temp form
                const addField = (name, value) => {
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = name;
                    input.value = value;
                    tempForm.appendChild(input);
                };

                // Map your website fields to Google Form entry IDs
                addField(ENTRY_IDS.fullName, fullName.value);
                addField(ENTRY_IDS.email, email.value);
                addField(ENTRY_IDS.phone, phone.value);
                addField(ENTRY_IDS.address, address.value);
                addField(ENTRY_IDS.roomType, roomType.value);
                addField(ENTRY_IDS.guests, guests.value);
                
                // Handle Date Fields
                if (checkIn.value) {
                    const d = new Date(checkIn.value);
                    addField(`${ENTRY_IDS.checkIn}_year`, d.getFullYear());
                    addField(`${ENTRY_IDS.checkIn}_month`, d.getMonth() + 1);
                    addField(`${ENTRY_IDS.checkIn}_day`, d.getDate());
                }
                
                if (checkOut.value) {
                    const d = new Date(checkOut.value);
                    addField(`${ENTRY_IDS.checkOut}_year`, d.getFullYear());
                    addField(`${ENTRY_IDS.checkOut}_month`, d.getMonth() + 1);
                    addField(`${ENTRY_IDS.checkOut}_day`, d.getDate());
                }

                // Handle the extra "Timestamp" date field
                const now = new Date();
                addField('entry.1166974658_year', now.getFullYear());
                addField('entry.1166974658_month', now.getMonth() + 1);
                addField('entry.1166974658_day', now.getDate());

                if (specialRequests) {
                    addField(ENTRY_IDS.specialRequests, specialRequests.value);
                }

                console.log('DEBUG: Submitting the following data:', {
                    url: GOOGLE_FORM_URL,
                    fullName: fullName.value,
                    email: email.value,
                    phone: phone.value,
                    address: address.value,
                    roomType: roomType.value,
                    checkIn: checkIn.value,
                    checkOut: checkOut.value,
                    guests: guests.value
                });

                document.body.appendChild(tempForm);
                tempForm.submit();

                // Handle UI feedback
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                    
                    if (bookingForm) {
                        bookingForm.style.display = 'none';
                    }
                    if (successMessage) {
                        successMessage.style.display = 'block';
                        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }

                    if (tempForm.parentNode) {
                        document.body.removeChild(tempForm);
                    }
                }, 1500);
            }
        });

        // Real-time error clearing
        const inputs = [fullName, email, phone, roomType, checkIn, checkOut, guests, address];
        const errorSpans = [errorFullName, errorEmail, errorPhone, errorRoomType, errorCheckIn, errorCheckOut, errorGuests, errorAddress];

        inputs.forEach((input, index) => {
            if (input) {
                input.addEventListener('input', () => {
                    if (input.classList.contains('invalid')) {
                        clearError(input, errorSpans[index]);
                    }
                });
            }
        });
    }

    // 4. Contact Form Logic
    const contactForm = document.getElementById('contactForm');
    const contactSuccess = document.getElementById('contact-success');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.btn-submit');
            const originalBtnText = submitBtn.textContent;
            
            const nameInput = document.getElementById('contact-name');
            const emailInput = document.getElementById('contact-email');
            const addressInput = document.getElementById('contact-address');
            const subjectInput = document.getElementById('contact-subject');
            const messageInput = document.getElementById('contact-message');

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const address = addressInput.value.trim();
            const subject = subjectInput.value.trim();
            const message = messageInput.value.trim();

            // Simple validation
            if (!name || !email || !address || !subject || !message) {
                return; // Browser 'required' should catch this, but just in case
            }

            // Show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            // GOOGLE FORM CONFIGURATION (Contact Form)
            const CONTACT_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfoXlCaTk4c334UhortJrgqOkQrZyBpHwBP9dJZRXeXaIKNaQ/formResponse';
            
            const CONTACT_ENTRY_IDS = {
                name: 'entry.2005620554',
                email: 'entry.1045781291',
                address: 'entry.1065046570',
                subject: 'entry.839337160',
                message: 'entry.556337781'
            };

            // Create hidden iframe if it doesn't exist
            let iframe = document.getElementById('hidden_iframe');
            if (!iframe) {
                iframe = document.createElement('iframe');
                iframe.id = 'hidden_iframe';
                iframe.name = 'hidden_iframe';
                iframe.style.display = 'none';
                document.body.appendChild(iframe);
            }

            // Create temporary form
            const tempForm = document.createElement('form');
            tempForm.action = CONTACT_FORM_URL;
            tempForm.method = 'POST';
            tempForm.target = 'hidden_iframe';

            const addField = (name, value) => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = name;
                input.value = value;
                tempForm.appendChild(input);
            };

            addField(CONTACT_ENTRY_IDS.name, name);
            addField(CONTACT_ENTRY_IDS.email, email);
            addField(CONTACT_ENTRY_IDS.address, address);
            addField(CONTACT_ENTRY_IDS.subject, subject);
            addField(CONTACT_ENTRY_IDS.message, message);

            document.body.appendChild(tempForm);
            tempForm.submit();

            // Handle UI feedback
            setTimeout(() => {
                contactForm.style.display = 'none';
                if (contactSuccess) {
                    contactSuccess.style.display = 'block';
                    contactSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                
                if (tempForm.parentNode) {
                    document.body.removeChild(tempForm);
                }
            }, 1500);
        });
    }

    // 5. Newsletter Logic
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('input');
            const submitBtn = newsletterForm.querySelector('button');
            
            if (emailInput.value.trim() !== '') {
                const originalText = submitBtn.textContent;
                submitBtn.disabled = true;
                submitBtn.textContent = '...';
                
                setTimeout(() => {
                    emailInput.value = '';
                    submitBtn.textContent = '✓';
                    setTimeout(() => {
                        submitBtn.disabled = false;
                        submitBtn.textContent = originalText;
                    }, 2000);
                }, 1000);
            }
        });
    }
});
