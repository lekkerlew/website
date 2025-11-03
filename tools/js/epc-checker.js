let currentStep = 0;
let answers = {
    ownership: null,
    size: null,
    buildingType: null,
    operational: null,
    renovations: null
};

function updateProgress() {
    const percentage = (currentStep / 5) * 100;
    document.getElementById('progress-bar').style.width = percentage + '%';
    document.getElementById('progress-text').textContent = currentStep + '/5';
}

function handleAnswer(question, answer) {
    answers[question] = answer;
    
    // Check if this answer invalidates EPC requirement
    if ((question === 'size' && answer === 'no') ||
        (question === 'buildingType' && answer === 'no') ||
        (question === 'operational' && answer === 'no') ||
        (question === 'renovations' && answer === 'yes')) {
        currentStep = 5;
    } else {
        currentStep++;
    }
    
    updateProgress();
    renderQuestion();
}

function getResult() {
    if (answers.size === 'no') return 'not-required';
    if (answers.buildingType === 'no') return 'not-required';
    if (answers.operational === 'no') return 'wait';
    if (answers.renovations === 'yes') return 'wait';
    return 'required';
}

function reset() {
    currentStep = 0;
    answers = {
        ownership: null,
        size: null,
        buildingType: null,
        operational: null,
        renovations: null
    };
    updateProgress();
    renderQuestion();
}

function renderQuestion() {
    const container = document.getElementById('question-container');
    
    if (currentStep === 0) {
        container.innerHTML = 
            '<div class="question-card">' +
                '<h2 class="question-title">Is your building:</h2>' +
                '<button class="answer-btn" onclick="handleAnswer(\'ownership\', \'private\')">' +
                    '<div class="answer-btn-title">Privately Owned</div>' +
                    '<div class="answer-btn-desc">Owned by a private company or individual</div>' +
                '</button>' +
                '<button class="answer-btn" onclick="handleAnswer(\'ownership\', \'government\')">' +
                    '<div class="answer-btn-title">Government Owned/Operated</div>' +
                    '<div class="answer-btn-desc">Owned, occupied, or operated by a government entity</div>' +
                '</button>' +
            '</div>';
    } else if (currentStep === 1) {
        const sizeThreshold = answers.ownership === 'private' ? '2,000 m²' : '1,000 m²';
        container.innerHTML = 
            '<div class="question-card">' +
                '<h2 class="question-title">Is your building\'s net floor area:</h2>' +
                '<div class="info-box">' +
                    '<strong>Net floor area:</strong> Total area between walls/partitions, excluding garages, parking, and storage rooms' +
                '</div>' +
                '<button class="answer-btn btn-yes" onclick="handleAnswer(\'size\', \'yes\')">' +
                    '<div class="answer-btn-title">' + sizeThreshold + ' or larger</div>' +
                    '<div class="answer-btn-desc">Continue to next question</div>' +
                '</button>' +
                '<button class="answer-btn" onclick="handleAnswer(\'size\', \'no\')">' +
                    '<div class="answer-btn-title">Less than ' + sizeThreshold + '</div>' +
                    '<div class="answer-btn-desc">EPC not required</div>' +
                '</button>' +
            '</div>';
    } else if (currentStep === 2) {
        container.innerHTML = 
            '<div class="question-card">' +
                '<h2 class="question-title">Does your building fall into one of these categories?</h2>' +
                '<button class="answer-btn btn-yes" onclick="handleAnswer(\'buildingType\', \'yes\')">' +
                    '<div class="answer-btn-title">YES - One of these:</div>' +
                    '<div class="answer-btn-desc">' +
                        '&bull; <strong>A1:</strong> Entertainment venues (restaurants, bars, recreation)<br>' +
                        '&bull; <strong>A2:</strong> Theaters, cinemas, indoor sports facilities<br>' +
                        '&bull; <strong>A3:</strong> Educational buildings (universities, colleges - NOT schools)<br>' +
                        '&bull; <strong>G1:</strong> Office buildings (multi-story offices, banks, office parks)' +
                    '</div>' +
                '</button>' +
                '<button class="answer-btn" onclick="handleAnswer(\'buildingType\', \'no\')">' +
                    '<div class="answer-btn-title">NO - Different building type</div>' +
                    '<div class="answer-btn-desc">EPC not currently required</div>' +
                '</button>' +
            '</div>';
    } else if (currentStep === 3) {
        container.innerHTML = 
            '<div class="question-card">' +
                '<h2 class="question-title">Has your building been operational for at least 2 years?</h2>' +
                '<button class="answer-btn btn-yes" onclick="handleAnswer(\'operational\', \'yes\')">' +
                    '<div class="answer-btn-title">YES - 2 years or more</div>' +
                    '<div class="answer-btn-desc">Continue to next question</div>' +
                '</button>' +
                '<button class="answer-btn" onclick="handleAnswer(\'operational\', \'no\')">' +
                    '<div class="answer-btn-title">NO - Less than 2 years</div>' +
                    '<div class="answer-btn-desc">Wait until 2 years of operation</div>' +
                '</button>' +
            '</div>';
    } else if (currentStep === 4) {
        container.innerHTML = 
            '<div class="question-card">' +
                '<h2 class="question-title">Has your building undergone major renovations in the past 2 years?</h2>' +
                '<button class="answer-btn btn-yes" onclick="handleAnswer(\'renovations\', \'no\')">' +
                    '<div class="answer-btn-title">NO - No major renovations</div>' +
                    '<div class="answer-btn-desc">Show final result</div>' +
                '</button>' +
                '<button class="answer-btn" onclick="handleAnswer(\'renovations\', \'yes\')">' +
                    '<div class="answer-btn-title">YES - Major renovations completed</div>' +
                    '<div class="answer-btn-desc">Wait 2 years after renovations</div>' +
                '</button>' +
            '</div>';
    } else if (currentStep === 5) {
        renderResult();
    }
}

function renderResult() {
    const container = document.getElementById('question-container');
    const result = getResult();
    
    if (result === 'required') {
        container.innerHTML = 
            '<div class="result-box result-required">' +
                '<div class="result-header">' +
                    '<h2 style="color: #dc3545;">EPC CERTIFICATE REQUIRED</h2>' +
                '</div>' +
                '<div class="warning-box">' +
                    '<div style="display: flex; gap: 15px; align-items: start;">' +
                        '<i class="fas fa-exclamation-triangle" style="font-size: 2em; color: #dc3545;"></i>' +
                        '<div>' +
                            '<p style="font-size: 1.1em;">' +
                                'Your building is currently at risk of non-compliance with the National Energy Act. ' +
                                'Failure to obtain and display an EPC certificate constitutes a criminal offence.' +
                            '</p>' +
                            '<div class="penalty-box">' +
                                '<p style="font-weight: bold; color: #721c24; margin-bottom: 5px;">Non-compliance penalties:</p>' +
                                '<p style="color: #721c24; margin: 0;">' +
                                    'Fine up to <strong>R5 million</strong> and/or imprisonment up to <strong>5 years</strong>' +
                                '</p>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="action-box">' +
                    '<h4>Action Required:</h4>' +
                    '<ol>' +
                        '<li>Register your building at <a href="https://epc.sanedi.org.za" target="_blank">epc.sanedi.org.za</a></li>' +
                        '<li>Hire a Registered EPC Professional</li>' +
                        '<li>Complete assessment and obtain certificate</li>' +
                        '<li>Display EPC at building entrance by <strong>7 December 2025</strong></li>' +
                        '<li>Submit certified copy to SANEDI within 3 months</li>' +
                    '</ol>' +
                '</div>' +
                '<div class="cta-box">' +
                    '<h4>Book Your EPC Assessment with Elite Energy Today</h4>' +
                    '<p>Contact us to book your EPC assessment and certification</p>' +
                    '<div>' +
                        '<a href="https://wa.me/27823313232?text=Hi%20Llewellyn%2C%20I%20need%20to%20book%20an%20EPC%20assessment%20for%20my%20building." ' +
                           'class="whatsapp-btn" target="_blank">' +
                            '<i class="fab fa-whatsapp whatsapp-icon"></i>' +
                            '<div style="text-align: left;">' +
                                '<div>Llewellyn</div>' +
                                '<div style="font-size: 0.85em; opacity: 0.9;">082 331 3232</div>' +
                            '</div>' +
                        '</a>' +
                        '<a href="https://wa.me/27833877644?text=Hi%20Chris%2C%20I%20need%20to%20book%20an%20EPC%20assessment%20for%20my%20building." ' +
                           'class="whatsapp-btn" target="_blank">' +
                            '<i class="fab fa-whatsapp whatsapp-icon"></i>' +
                            '<div style="text-align: left;">' +
                                '<div>Chris</div>' +
                                '<div style="font-size: 0.85em; opacity: 0.9;">083 387 7644</div>' +
                            '</div>' +
                        '</a>' +
                    '</div>' +
                '</div>' +
                '<div style="text-align: center; margin-top: 25px;">' +
                    '<button class="btn btn-reset" onclick="reset()">' +
                        '<i class="fas fa-redo"></i> Start Over' +
                    '</button>' +
                '</div>' +
            '</div>';
    } else if (result === 'not-required') {
        container.innerHTML = 
            '<div class="result-box result-not-required">' +
                '<div class="result-header">' +
                    '<i class="fas fa-check-circle" style="font-size: 3em; color: #28a745; margin-bottom: 15px;"></i>' +
                    '<h2 style="color: #28a745;">EPC NOT REQUIRED</h2>' +
                '</div>' +
                '<div class="action-box">' +
                    '<p style="color: #155724; font-size: 1.1em; margin-bottom: 15px;">' +
                        'Based on your answers, your building is not currently required to obtain an EPC certificate.' +
                    '</p>' +
                    '<p style="color: #155724; margin: 0;">' +
                        '<strong>Recommendation:</strong> Keep yourself updated with EPC requirements as regulations may change in the future.' +
                    '</p>' +
                '</div>' +
                '<div style="text-align: center; margin-top: 25px;">' +
                    '<button class="btn btn-reset" onclick="reset()">' +
                        '<i class="fas fa-redo"></i> Start Over' +
                    '</button>' +
                '</div>' +
            '</div>';
    } else if (result === 'wait') {
        let waitMessage = '';
        if (answers.operational === 'no') {
            waitMessage = '<strong>Wait until:</strong> Your building has been operational for at least 2 years.';
        } else if (answers.renovations === 'yes') {
            waitMessage = '<strong>Wait until:</strong> 2 years after major renovations are complete.';
        }
        
        container.innerHTML = 
            '<div class="result-box result-wait">' +
                '<div class="result-header">' +
                    '<i class="fas fa-info-circle" style="font-size: 3em; color: #0d6efd; margin-bottom: 15px;"></i>' +
                    '<h2 style="color: #0d6efd;">NOT YET REQUIRED</h2>' +
                '</div>' +
                '<div class="action-box">' +
                    '<p style="color: #084298; font-size: 1.1em; margin-bottom: 15px;">' +
                        'Your building does not currently require an EPC, but this may change.' +
                    '</p>' +
                    '<p style="color: #084298; margin-bottom: 10px;">' + waitMessage + '</p>' +
                    '<p style="color: #084298; margin: 0;">' +
                        'You will need to apply for an EPC once this waiting period is complete.' +
                    '</p>' +
                '</div>' +
                '<div style="text-align: center; margin-top: 25px;">' +
                    '<button class="btn btn-reset" onclick="reset()">' +
                        '<i class="fas fa-redo"></i> Start Over' +
                    '</button>' +
                '</div>' +
            '</div>';
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    renderQuestion();
});