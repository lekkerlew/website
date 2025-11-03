/**
 * EPC Requirements Calculator
 * Determines if a building needs an Energy Performance Certificate
 */

(function() {
    'use strict';

    // State management
    let currentStep = 0;
    let answers = {
        ownership: null,
        buildingType: null,
        size: null,
        operational: null,
        renovations: null
    };

    // Building type configuration
    const BUILDING_TYPES = {
        A1: {
            id: 'A1',
            name: 'A1: Entertainment & Public Assembly',
            desc: 'Restaurants, bars, nightclubs, recreation venues'
        },
        A2: {
            id: 'A2',
            name: 'A2: Theatrical & Indoor Sport',
            desc: 'Cinemas, theaters, concert halls, indoor sports facilities'
        },
        A3_UNIVERSITY: {
            id: 'A3_UNIVERSITY',
            name: 'A3: University/College',
            desc: 'Universities, colleges, higher education institutions'
        },
        A3_SCHOOL: {
            id: 'A3_SCHOOL',
            name: 'A3: School',
            desc: 'Primary and secondary schools (not covered by current EPC regulation)'
        },
        G1_MULTI: {
            id: 'G1_MULTI',
            name: 'G1: Large Multi-Story Office',
            desc: 'Large office buildings, banks, office buildings with lifts and energy services'
        },
        G1_STANDALONE: {
            id: 'G1_STANDALONE',
            name: 'G1: Standalone Office/Office Park',
            desc: 'Standalone office blocks, office parks, campus office buildings'
        },
        OTHER: {
            id: 'OTHER',
            name: 'Other Building Type',
            desc: 'Shopping centers, warehouses, residential, industrial, or other uses'
        }
    };

    /**
     * Update the progress bar and text
     */
    function updateProgress() {
        const progressBar = document.getElementById('epc-progress-bar');
        const progressText = document.getElementById('epc-progress-text');
        
        if (progressBar) {
            const percentage = (currentStep / 5) * 100;
            progressBar.style.width = percentage + '%';
            progressBar.setAttribute('aria-valuenow', percentage);
        }
        
        if (progressText) {
            progressText.textContent = currentStep + '/5';
        }
    }

    /**
     * Handle user answer selection
     */
    function handleAnswer(question, answer) {
        answers[question] = answer;
        
        // Check if this answer eliminates EPC requirement
        if ((question === 'buildingType' && answer === 'OTHER') ||
            (question === 'buildingType' && answer === 'A3_SCHOOL') ||
            (question === 'size' && answer === 'no') ||
            (question === 'operational' && answer === 'no') ||
            (question === 'renovations' && answer === 'yes')) {
            currentStep = 5;
        } else {
            currentStep++;
        }
        
        updateProgress();
        renderQuestion();
    }

    /**
     * Determine the final result based on all answers
     */
    function getResult() {
        // Check for disqualifying answers
        if (answers.buildingType === 'OTHER' || answers.buildingType === 'A3_SCHOOL') {
            return 'not-required';
        }
        if (answers.size === 'no') {
            return 'not-required';
        }
        if (answers.operational === 'no') {
            return 'wait-operational';
        }
        if (answers.renovations === 'yes') {
            return 'wait-renovations';
        }
        return 'required';
    }

    /**
     * Reset calculator to initial state
     */
    function reset() {
        currentStep = 0;
        answers = {
            ownership: null,
            buildingType: null,
            size: null,
            operational: null,
            renovations: null
        };
        updateProgress();
        renderQuestion();
    }

    /**
     * Render the appropriate question based on current step
     */
    function renderQuestion() {
        const container = document.getElementById('epc-question-container');
        
        if (!container) {
            console.error('EPC question container not found');
            return;
        }
        
        if (currentStep === 0) {
            renderOwnershipQuestion(container);
        } else if (currentStep === 1) {
            renderBuildingTypeQuestion(container);
        } else if (currentStep === 2) {
            renderSizeQuestion(container);
        } else if (currentStep === 3) {
            renderOperationalQuestion(container);
        } else if (currentStep === 4) {
            renderRenovationsQuestion(container);
        } else if (currentStep === 5) {
            renderResult(container);
        }
    }

    /**
     * Step 0: Ownership Question
     */
    function renderOwnershipQuestion(container) {
        container.innerHTML = `
            <div class="question-card">
                <h2 class="question-title">Is your building:</h2>
                <button class="answer-btn btn-yes" onclick="window.epcCalculator.handleAnswer('ownership', 'private')">
                    <div class="answer-btn-title">Privately Owned</div>
                    <div class="answer-btn-desc">Owned by a private company or individual</div>
                </button>
                <button class="answer-btn btn-yes" onclick="window.epcCalculator.handleAnswer('ownership', 'government')">
                    <div class="answer-btn-title">Government Owned/Operated</div>
                    <div class="answer-btn-desc">Owned, occupied, or operated by a government entity</div>
                </button>
            </div>
        `;
    }

    /**
     * Step 1: Building Type Question
     */
    function renderBuildingTypeQuestion(container) {
        container.innerHTML = `
            <div class="question-card">
                <h2 class="question-title">What is your building's primary use?</h2>
                <button class="answer-btn" onclick="window.epcCalculator.handleAnswer('buildingType', 'A1')">
                    <div class="answer-btn-title">${BUILDING_TYPES.A1.name}</div>
                    <div class="answer-btn-desc">${BUILDING_TYPES.A1.desc}</div>
                </button>
                <button class="answer-btn" onclick="window.epcCalculator.handleAnswer('buildingType', 'A2')">
                    <div class="answer-btn-title">${BUILDING_TYPES.A2.name}</div>
                    <div class="answer-btn-desc">${BUILDING_TYPES.A2.desc}</div>
                </button>
                <button class="answer-btn" onclick="window.epcCalculator.handleAnswer('buildingType', 'A3_UNIVERSITY')">
                    <div class="answer-btn-title">${BUILDING_TYPES.A3_UNIVERSITY.name}</div>
                    <div class="answer-btn-desc">${BUILDING_TYPES.A3_UNIVERSITY.desc}</div>
                </button>
                <button class="answer-btn" onclick="window.epcCalculator.handleAnswer('buildingType', 'A3_SCHOOL')">
                    <div class="answer-btn-title">${BUILDING_TYPES.A3_SCHOOL.name}</div>
                    <div class="answer-btn-desc">${BUILDING_TYPES.A3_SCHOOL.desc}</div>
                </button>
                <button class="answer-btn" onclick="window.epcCalculator.handleAnswer('buildingType', 'G1_MULTI')">
                    <div class="answer-btn-title">${BUILDING_TYPES.G1_MULTI.name}</div>
                    <div class="answer-btn-desc">${BUILDING_TYPES.G1_MULTI.desc}</div>
                </button>
                <button class="answer-btn" onclick="window.epcCalculator.handleAnswer('buildingType', 'G1_STANDALONE')">
                    <div class="answer-btn-title">${BUILDING_TYPES.G1_STANDALONE.name}</div>
                    <div class="answer-btn-desc">${BUILDING_TYPES.G1_STANDALONE.desc}</div>
                </button>
                <button class="answer-btn" onclick="window.epcCalculator.handleAnswer('buildingType', 'OTHER')">
                    <div class="answer-btn-title">${BUILDING_TYPES.OTHER.name}</div>
                    <div class="answer-btn-desc">${BUILDING_TYPES.OTHER.desc}</div>
                </button>
            </div>
        `;
    }

    /**
     * Step 2: Net Floor Area Question
     */
    function renderSizeQuestion(container) {
        const sizeThreshold = answers.ownership === 'private' ? '2,000 m²' : '1,000 m²';
        const sizeThresholdNum = answers.ownership === 'private' ? 2000 : 1000;
        
        container.innerHTML = `
            <div class="question-card">
                <h2 class="question-title">Is your building's net floor area:</h2>
                <div class="info-box">
                    <strong>Net floor area definition:</strong> Total usable area between walls/partitions, excluding garages, car parks, and storage rooms
                </div>
                <button class="answer-btn btn-yes" onclick="window.epcCalculator.handleAnswer('size', 'yes')">
                    <div class="answer-btn-title">${sizeThreshold} or larger</div>
                    <div class="answer-btn-desc">Your building meets the size requirement for EPC</div>
                </button>
                <button class="answer-btn" onclick="window.epcCalculator.handleAnswer('size', 'no')">
                    <div class="answer-btn-title">Less than ${sizeThreshold}</div>
                    <div class="answer-btn-desc">EPC is not required due to building size</div>
                </button>
            </div>
        `;
    }

    /**
     * Step 3: Operational Status Question
     */
    function renderOperationalQuestion(container) {
        container.innerHTML = `
            <div class="question-card">
                <h2 class="question-title">Has your building been operational for at least 2 years?</h2>
                <div class="info-box">
                    <strong>Operational requirement:</strong> Your building must have been in its current use for a minimum of 2 consecutive years
                </div>
                <button class="answer-btn btn-yes" onclick="window.epcCalculator.handleAnswer('operational', 'yes')">
                    <div class="answer-btn-title">YES - 2 years or more</div>
                    <div class="answer-btn-desc">Continue to the final question</div>
                </button>
                <button class="answer-btn" onclick="window.epcCalculator.handleAnswer('operational', 'no')">
                    <div class="answer-btn-title">NO - Less than 2 years</div>
                    <div class="answer-btn-desc">EPC will be required once 2-year mark is reached</div>
                </button>
            </div>
        `;
    }

    /**
     * Step 4: Recent Renovations Question
     */
    function renderRenovationsQuestion(container) {
        container.innerHTML = `
            <div class="question-card">
                <h2 class="question-title">Has your building undergone major renovations in the past 2 years?</h2>
                <div class="info-box">
                    <strong>Major renovation:</strong> Significant structural or systems changes that substantially affect net floor area or energy performance
                </div>
                <button class="answer-btn btn-yes" onclick="window.epcCalculator.handleAnswer('renovations', 'no')">
                    <div class="answer-btn-title">NO - No major renovations</div>
                    <div class="answer-btn-desc">Show your EPC requirement result</div>
                </button>
                <button class="answer-btn" onclick="window.epcCalculator.handleAnswer('renovations', 'yes')">
                    <div class="answer-btn-title">YES - Major renovations completed</div>
                    <div class="answer-btn-desc">EPC required 2 years after renovation completion</div>
                </button>
            </div>
        `;
    }

    /**
     * Render the final result screen
     */
    function renderResult(container) {
        const result = getResult();
        
        if (result === 'required') {
            container.innerHTML = renderRequiredResult();
        } else if (result === 'not-required') {
            container.innerHTML = renderNotRequiredResult();
        } else if (result === 'wait-operational') {
            container.innerHTML = renderWaitOperationalResult();
        } else if (result === 'wait-renovations') {
            container.innerHTML = renderWaitRenovationsResult();
        }
    }

    /**
     * Result: EPC Required
     */
    function renderRequiredResult() {
        return `
            <div class="result-box result-required">
                <div class="result-header">
                    <i class="fas fa-exclamation-triangle" style="color: #dc3545;"></i>
                    <h2 style="color: #dc3545;">EPC CERTIFICATE REQUIRED</h2>
                </div>
                
                <div class="warning-box">
                    <p><strong>Your building must comply by 7 December 2025</strong></p>
                    <p>Failure to obtain and display an Energy Performance Certificate is a criminal offence under the National Energy Act.</p>
                    <div class="penalty-box">
                        <p>Non-compliance penalties:</p>
                        <p>• Fine up to <strong>R5,000,000</strong></p>
                        <p>• Imprisonment up to <strong>5 years</strong></p>
                        <p>• Or both</p>
                    </div>
                </div>

                <div class="deadline-highlight">
                    <strong>⏰ Deadline: 7 December 2025</strong><br>
                    Start the EPC process now to ensure full compliance
                </div>

                <div class="action-box">
                    <h4>What You Need to Do:</h4>
                    <ol>
                        <li><strong>Register your building</strong> at <a href="https://epc.sanedi.org.za" target="_blank">epc.sanedi.org.za</a></li>
                        <li><strong>Hire a Registered EPC Professional</strong> to conduct the energy assessment</li>
                        <li><strong>Complete the assessment</strong> - professional will measure your building's energy consumption</li>
                        <li><strong>Receive and display your EPC</strong> at your building entrance in full colour on A4 paper</li>
                        <li><strong>Submit certified copy to SANEDI</strong> within 3 months of certificate issue date</li>
                    </ol>
                </div>

                <div class="cta-box">
                    <h4><i class="fas fa-phone"></i> Book Your EPC Assessment Today</h4>
                    <p>Contact Elite Energy Solutions to get started with your EPC certification</p>
                    <div class="contact-buttons">
                        <a href="https://wa.me/27823313232?text=Hi%20Llewellyn%2C%20I%20need%20to%20book%20an%20EPC%20assessment%20for%20my%20building." 
                           class="whatsapp-btn" target="_blank">
                            <i class="fab fa-whatsapp"></i>
                            <div style="text-align: left;">
                                <div>Llewellyn</div>
                                <div style="font-size: 0.85em; opacity: 0.9;">082 331 3232</div>
                            </div>
                        </a>
                        <a href="https://wa.me/27833877644?text=Hi%20Chris%2C%20I%20need%20to%20book%20an%20EPC%20assessment%20for%20my%20building." 
                           class="whatsapp-btn" target="_blank">
                            <i class="fab fa-whatsapp"></i>
                            <div style="text-align: left;">
                                <div>Chris</div>
                                <div style="font-size: 0.85em; opacity: 0.9;">083 387 7644</div>
                            </div>
                        </a>
                    </div>
                </div>

                <div class="button-group">
                    <button class="btn btn-reset" onclick="window.epcCalculator.reset()">
                        <i class="fas fa-redo"></i> Start Over
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Result: EPC Not Required
     */
    function renderNotRequiredResult() {
        return `
            <div class="result-box result-not-required">
                <div class="result-header">
                    <i class="fas fa-check-circle" style="color: #28a745;"></i>
                    <h2 style="color: #28a745;">EPC NOT REQUIRED</h2>
                </div>
                <div class="action-box">
                    <p style="color: #155724; font-size: 15px; margin-bottom: 15px;">
                        Based on your answers, your building is <strong>not currently required</strong> to obtain an Energy Performance Certificate.
                    </p>
                    <p style="color: #155724; margin: 0;">
                        <strong>Recommendation:</strong> Keep informed about changes to EPC regulations, as requirements may expand in the future.
                    </p>
                </div>
                <div class="button-group">
                    <button class="btn btn-reset" onclick="window.epcCalculator.reset()">
                        <i class="fas fa-redo"></i> Start Over
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Result: Wait - Building Not Yet Operational
     */
    function renderWaitOperationalResult() {
        return `
            <div class="result-box result-wait">
                <div class="result-header">
                    <i class="fas fa-clock" style="color: #0d6efd;"></i>
                    <h2 style="color: #0d6efd;">NOT YET REQUIRED</h2>
                </div>
                <div class="action-box">
                    <p style="color: #084298; font-size: 15px; margin-bottom: 15px;">
                        Your building does not currently require an EPC, but this will change.
                    </p>
                    <p style="color: #084298; margin-bottom: 10px;">
                        <strong>Wait until:</strong> Your building has completed 2 years of continuous operation in its current use
                    </p>
                    <p style="color: #084298; margin: 0;">
                        Once the 2-year operational period is complete, you will need to apply for an EPC. Set a reminder to start the process before the national deadline of 7 December 2025.
                    </p>
                </div>
                <div class="button-group">
                    <button class="btn btn-reset" onclick="window.epcCalculator.reset()">
                        <i class="fas fa-redo"></i> Start Over
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Result: Wait - Recent Renovations
     */
    function renderWaitRenovationsResult() {
        return `
            <div class="result-box result-wait">
                <div class="result-header">
                    <i class="fas fa-clock" style="color: #0d6efd;"></i>
                    <h2 style="color: #0d6efd;">NOT YET REQUIRED</h2>
                </div>
                <div class="action-box">
                    <p style="color: #084298; font-size: 15px; margin-bottom: 15px;">
                        Your building does not currently require an EPC due to recent renovations.
                    </p>
                    <p style="color: #084298; margin-bottom: 10px;">
                        <strong>Wait until:</strong> 2 years have passed since your major renovations were completed
                    </p>
                    <p style="color: #084298; margin: 0;">
                        After the 2-year waiting period, you will need to apply for an EPC. Make sure to plan ahead and contact a Registered EPC Professional before the national deadline of 7 December 2025.
                    </p>
                </div>
                <div class="button-group">
                    <button class="btn btn-reset" onclick="window.epcCalculator.reset()">
                        <i class="fas fa-redo"></i> Start Over
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Initialize the calculator
     */
    function init() {
        updateProgress();
        renderQuestion();
    }

    /**
     * Wait for DOM to be ready
     */
    function ensureDOMReady() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }
    }

    // Expose public API
    window.epcCalculator = {
        handleAnswer: handleAnswer,
        reset: reset,
        init: init
    };

    // Initialize when DOM is ready
    ensureDOMReady();

})();