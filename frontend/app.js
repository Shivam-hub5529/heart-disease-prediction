/* =========================================================
   HEARTPREDICT AI
   FRONTEND JAVASCRIPT
========================================================= */


/* =========================================================
   ELEMENTS
========================================================= */

const predictionForm =
    document.getElementById("predictionForm");

const predictButton =
    document.getElementById("predictButton");

const buttonLoader =
    document.getElementById("buttonLoader");

const resultPlaceholder =
    document.getElementById("resultPlaceholder");

const resultContent =
    document.getElementById("resultContent");

const resultCard =
    document.getElementById("resultCard");

const resultTitle =
    document.getElementById("resultTitle");

const resultDescription =
    document.getElementById("resultDescription");

const resultMessage =
    document.getElementById("resultMessage");

const confidenceValue =
    document.getElementById("confidenceValue");

const confidenceProgress =
    document.getElementById("confidenceProgress");

const resultStatus =
    document.getElementById("resultStatus");

const menuButton =
    document.getElementById("menuButton");

const navLinks =
    document.getElementById("navLinks");


/* =========================================================
   MOBILE MENU
========================================================= */

if (menuButton) {

    menuButton.addEventListener(
        "click",
        () => {

            navLinks.classList.toggle(
                "mobile-open"
            );

        }
    );

}


document
    .querySelectorAll(".nav-links a")
    .forEach(link => {

        link.addEventListener(
            "click",
            () => {

                navLinks.classList.remove(
                    "mobile-open"
                );

            }
        );

    });


/* =========================================================
   FORM VALIDATION
========================================================= */

function validateForm() {

    let isValid = true;

    const fields =
        predictionForm.querySelectorAll(
            "input[required], select[required]"
        );


    fields.forEach(field => {

        const group =
            field.closest(".form-group");

        const error =
            group.querySelector(".error-message");


        group.classList.remove(
            "input-error"
        );


        error.textContent = "";


        if (!field.value.trim()) {

            isValid = false;

            group.classList.add(
                "input-error"
            );

            error.textContent =
                "Please provide this information.";

            return;

        }


        /* Numeric validation */

        if (
            field.type === "number" &&
            field.value !== ""
        ) {

            const value =
                Number(field.value);


            if (
                field.min &&
                value < Number(field.min)
            ) {

                isValid = false;

                group.classList.add(
                    "input-error"
                );

                error.textContent =
                    `Minimum value is ${field.min}.`;

            }


            if (
                field.max &&
                value > Number(field.max)
            ) {

                isValid = false;

                group.classList.add(
                    "input-error"
                );

                error.textContent =
                    `Maximum value is ${field.max}.`;

            }

        }

    });


    return isValid;

}


/* =========================================================
   REMOVE ERROR WHILE TYPING
========================================================= */

predictionForm
    .querySelectorAll(
        "input, select"
    )
    .forEach(field => {

        field.addEventListener(
            "input",
            () => {

                const group =
                    field.closest(
                        ".form-group"
                    );

                const error =
                    group.querySelector(
                        ".error-message"
                    );

                group.classList.remove(
                    "input-error"
                );

                error.textContent = "";

            }
        );


        field.addEventListener(
            "change",
            () => {

                const group =
                    field.closest(
                        ".form-group"
                    );

                const error =
                    group.querySelector(
                        ".error-message"
                    );

                group.classList.remove(
                    "input-error"
                );

                error.textContent = "";

            }
        );

    });


/* =========================================================
   GET FORM DATA
========================================================= */

function getFormData() {

    return {

        age:
            Number(
                document.getElementById(
                    "age"
                ).value
            ),

        sex:
            Number(
                document.getElementById(
                    "sex"
                ).value
            ),

        cp:
            Number(
                document.getElementById(
                    "cp"
                ).value
            ),

        trestbps:
            Number(
                document.getElementById(
                    "trestbps"
                ).value
            ),

        chol:
            Number(
                document.getElementById(
                    "chol"
                ).value
            ),

        fbs:
            Number(
                document.getElementById(
                    "fbs"
                ).value
            ),

        restecg:
            Number(
                document.getElementById(
                    "restecg"
                ).value
            ),

        thalach:
            Number(
                document.getElementById(
                    "thalach"
                ).value
            ),

        exang:
            Number(
                document.getElementById(
                    "exang"
                ).value
            ),

        oldpeak:
            Number(
                document.getElementById(
                    "oldpeak"
                ).value
            ),

        slope:
            Number(
                document.getElementById(
                    "slope"
                ).value
            ),

        ca:
            Number(
                document.getElementById(
                    "ca"
                ).value
            ),

        thal:
            Number(
                document.getElementById(
                    "thal"
                ).value
            )

    };

}


/* =========================================================
   LOADING STATE
========================================================= */

function setLoadingState(isLoading) {

    if (isLoading) {

        predictButton.disabled =
            true;

        predictButton.classList.add(
            "loading"
        );

    } else {

        predictButton.disabled =
            false;

        predictButton.classList.remove(
            "loading"
        );

    }

}


/* =========================================================
   DISPLAY RESULT
========================================================= */

function displayResult(data) {

    const prediction =
        Number(data.prediction);

    const confidence =
        Number(data.confidence);


    resultPlaceholder.hidden =
        true;

    resultContent.hidden =
        false;


    resultCard.classList.remove(
        "high-risk",
        "low-risk"
    );


    if (prediction === 1) {

        /* Higher predicted risk */

        resultCard.classList.add(
            "high-risk"
        );

        resultTitle.textContent =
            "Higher Predicted Risk";

        resultDescription.textContent =
            "The model predicts a higher likelihood based on the information provided.";

        resultMessage.textContent =
            "This is an AI-generated prediction, not a medical diagnosis.";

        resultStatus.textContent =
            "●";

    } else {

        /* Lower predicted risk */

        resultCard.classList.add(
            "low-risk"
        );

        resultTitle.textContent =
            "Lower Predicted Risk";

        resultDescription.textContent =
            "The model predicts a lower likelihood based on the information provided.";

        resultMessage.textContent =
            "This is an AI-generated prediction, not a medical diagnosis.";

        resultStatus.textContent =
            "●";

    }


    /* Reset confidence */

    confidenceValue.textContent =
        "0%";

    confidenceProgress.style.width =
        "0%";


    /* Animate confidence */

    setTimeout(
        () => {

            confidenceProgress.style.width =
                `${confidence}%`;

            animateNumber(
                confidenceValue,
                confidence
            );

        },
        100
    );


    /* Scroll to result on mobile */

    if (
        window.innerWidth <= 900
    ) {

        setTimeout(
            () => {

                resultCard.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

            },
            250
        );

    }

}


/* =========================================================
   CONFIDENCE NUMBER ANIMATION
========================================================= */

function animateNumber(
    element,
    target
) {

    const duration =
        900;

    const start =
        performance.now();


    function update(currentTime) {

        const elapsed =
            currentTime - start;

        const progress =
            Math.min(
                elapsed / duration,
                1
            );


        const eased =
            1 -
            Math.pow(
                1 - progress,
                3
            );


        const current =
            target * eased;


        element.textContent =
            `${current.toFixed(2)}%`;


        if (progress < 1) {

            requestAnimationFrame(
                update
            );

        }

    }


    requestAnimationFrame(
        update
    );

}


/* =========================================================
   API ERROR DISPLAY
========================================================= */

function displayError(message) {

    resultPlaceholder.hidden =
        true;

    resultContent.hidden =
        false;


    resultCard.classList.remove(
        "high-risk",
        "low-risk"
    );


    resultTitle.textContent =
        "Unable to Analyze";

    resultDescription.textContent =
        message;

    resultMessage.textContent =
        "Please check your information and try again.";

    confidenceValue.textContent =
        "--";

    confidenceProgress.style.width =
        "0%";

    resultStatus.textContent =
        "!";


    resultStatus.style.color =
        "#dc3545";


    resultContent.classList.remove(
        "error-animation"
    );

}


/* =========================================================
   FORM SUBMISSION
========================================================= */

predictionForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        /* Validate */

        if (!validateForm()) {

            const firstError =
                predictionForm.querySelector(
                    ".input-error input, .input-error select"
                );


            if (firstError) {

                firstError.focus();

            }

            return;

        }


        /* Reset status */

        resultStatus.style.color =
            "";


        /* Loading */

        setLoadingState(true);


        /* Get data */

        const data =
            getFormData();


        try {

            /*
                IMPORTANT:

                Use relative API URL.

                DO NOT use:

                http://127.0.0.1:8000/api/predict

                Vercel uses:

                /api/predict
            */

            const response =
                await fetch(
                    "/api/predict",
                    {

                        method:
                            "POST",

                        headers:
                            {
                                "Content-Type":
                                    "application/json"
                            },

                        body:
                            JSON.stringify(data)

                    }
                );


            /* HTTP error */

            if (!response.ok) {

                throw new Error(
                    "Prediction service returned an error."
                );

            }


            const result =
                await response.json();


            /* Validate response */

            if (
                typeof result.prediction ===
                    "undefined" ||

                typeof result.confidence ===
                    "undefined"
            ) {

                throw new Error(
                    "Invalid response received from the prediction service."
                );

            }


            /* Display */

            displayResult(
                result
            );


        } catch (error) {

            console.error(
                "Prediction error:",
                error
            );


            displayError(
                "Unable to connect to the prediction service. Please try again."
            );

        } finally {

            setLoadingState(
                false
            );

        }

    }
);


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /*
            Make sure result is hidden
            initially.
        */

        if (resultContent) {

            resultContent.hidden =
                true;

        }


        if (resultPlaceholder) {

            resultPlaceholder.hidden =
                false;

        }

    }
);