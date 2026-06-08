/* ============================================
   NEW STATE RP - ADMIN PANEL JAVASCRIPT
   Interactive Dashboard Functionality
   ============================================ */

// ==================== UTILITY FUNCTIONS ====================

// Animate number counting
function animateCounter(element, target) {
    const duration = 1500;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const tick = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current).toLocaleString();
            requestAnimationFrame(tick);
        } else {
            element.textContent = target.toLocaleString();
        }
    };

    tick();
}

// Generate mini chart bars
function generateMiniChart(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    const barCount = 20;
    for (let i = 0; i < barCount; i++) {
        const bar = document.createElement('div');
        const height = Math.random() * 80 + 20;
        bar.style.cssText = `
            flex: 1;
            height: ${height}%;
            background: linear-gradient(180deg, var(--accent-primary), var(--accent-secondary));
            border-radius: 2px 2px 0 0;
            box-shadow: 0 0 10px rgba(0, 255, 136, 0.3);
            opacity: 0.8;
            transition: all 0.3s ease;
        `;

        bar.addEventListener('mouseenter', function () {
            this.style.opacity = '1';
            this.style.boxShadow = '0 0 20px rgba(0, 255, 136, 0.6)';
        });

        bar.addEventListener('mouseleave', function () {
            this.style.opacity = '0.8';
            this.style.boxShadow = '0 0 10px rgba(0, 255, 136, 0.3)';
        });

        container.appendChild(bar);
    }
}

// Economy chart with animated growth
function generateEconomyChart(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    const barCount = 24; // 24 hours
    for (let i = 0; i < barCount; i++) {
        const bar = document.createElement('div');
        const height = Math.random() * 70 + 30;
        const timeOfDay = i / barCount;

        // Create more activity during day hours
        const adjustedHeight = Math.sin(timeOfDay * Math.PI) * 40 + 40 + (Math.random() * 20 - 10);

        bar.style.cssText = `
            flex: 1;
            height: ${Math.max(20, adjustedHeight)}%;
            background: linear-gradient(180deg, var(--accent-secondary), var(--accent-warning));
            border-radius: 2px 2px 0 0;
            box-shadow: 0 0 10px rgba(0, 212, 255, 0.3);
            opacity: 0.85;
            transition: all 0.3s ease;
            cursor: pointer;
        `;

        bar.addEventListener('mouseenter', function () {
            this.style.opacity = '1';
            this.style.boxShadow = '0 0 20px rgba(0, 212, 255, 0.6), 0 0 40px rgba(255, 165, 0, 0.3)';
            this.style.transform = 'scaleY(1.1)';
        });

        bar.addEventListener('mouseleave', function () {
            this.style.opacity = '0.85';
            this.style.boxShadow = '0 0 10px rgba(0, 212, 255, 0.3)';
            this.style.transform = 'scaleY(1)';
        });

        container.appendChild(bar);
    }
}

// Show toast notification
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        background: var(--bg-secondary);
        border: 1px solid var(--glass-border);
        border-radius: 8px;
        color: var(--text-primary);
        z-index: 200;
        animation: slideInRight 0.3s ease-out;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        font-size: 14px;
        font-weight: 500;
    `;

    if (type === 'success') {
        toast.style.borderColor = 'var(--accent-primary)';
        toast.style.boxShadow = '0 0 20px rgba(0, 255, 136, 0.2), 0 10px 30px rgba(0, 0, 0, 0.3)';
    } else if (type === 'danger') {
        toast.style.borderColor = 'var(--accent-danger)';
        toast.style.boxShadow = '0 0 20px rgba(255, 0, 85, 0.2), 0 10px 30px rgba(0, 0, 0, 0.3)';
    }

    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-out forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ==================== PANEL NAVIGATION ====================

document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', function () {
        const panelId = this.dataset.panel;

        // Update active menu item
        document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
        this.classList.add('active');

        // Update active panel
        document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
        const panel = document.getElementById(panelId);
        if (panel) {
            panel.classList.add('active');

            // Generate charts on dashboard
            if (panelId === 'dashboard') {
                generateMiniChart('playersChart');
                generateEconomyChart('economyChart');
                animateStats();
            }

            // Generate economy chart on economy panel
            if (panelId === 'economy') {
                generateEconomyChart('economyProgressChart');
            }
        }
    });
});

// ==================== STAT ANIMATIONS ====================

function animateStats() {
    document.querySelectorAll('[data-count]').forEach(element => {
        const target = parseInt(element.dataset.count);
        animateCounter(element, target);
    });
}

// Initial stat animations on page load
window.addEventListener('load', () => {
    animateStats();
    generateMiniChart('playersChart');
    generateEconomyChart('economyChart');
});

// ==================== MODAL SYSTEM ====================

let currentModalAction = null;

function showConfirmModal(title, message, action = null) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalMessage').textContent = message;
    currentModalAction = action;
    document.getElementById('modalOverlay').classList.add('active');
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
    currentModalAction = null;
}

function confirmAction() {
    if (currentModalAction && typeof currentModalAction === 'function') {
        currentModalAction();
    }
    showToast('Action confirmed!', 'success');
    closeModal();
}

// Close modal on overlay click
document.getElementById('modalOverlay').addEventListener('click', function (e) {
    if (e.target === this) {
        closeModal();
    }
});

// Close modal on close button
document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', closeModal);
});

// ==================== PLAYER MODAL ====================

function showPlayerModal(playerId, playerName, playerLevel, playerMoney, playerJob) {
    document.getElementById('playerDetailId').textContent = playerId;
    document.getElementById('playerDetailName').textContent = playerName;
    document.getElementById('playerDetailLevel').textContent = playerLevel;
    document.getElementById('playerDetailMoney').textContent = playerMoney;
    document.getElementById('playerDetailJob').textContent = playerJob;
    document.getElementById('playerModalOverlay').classList.add('active');
}

function closePlayerModal() {
    document.getElementById('playerModalOverlay').classList.remove('active');
}

// Player action buttons
document.querySelectorAll('.view-player').forEach(btn => {
    btn.addEventListener('click', function () {
        const row = this.closest('tr');
        const cells = row.querySelectorAll('td');
        showPlayerModal(
            cells[0].textContent,
            cells[1].textContent,
            cells[2].textContent,
            cells[3].textContent,
            cells[4].textContent
        );
    });
});

// Close player modal on overlay click
document.getElementById('playerModalOverlay').addEventListener('click', function (e) {
    if (e.target === this) {
        closePlayerModal();
    }
});

// ==================== PLAYER ACTIONS ====================

document.querySelectorAll('.kick').forEach(btn => {
    btn.addEventListener('click', function () {
        const playerName = this.closest('tr').querySelector('td:nth-child(2)').textContent;
        showConfirmModal(
            'Spieler Kicken',
            `Bist du sicher, dass du ${playerName} kicken möchtest?`,
            () => showToast(`${playerName} wurde gekickt!`, 'success')
        );
    });
});

document.querySelectorAll('.ban').forEach(btn => {
    btn.addEventListener('click', function () {
        const playerName = this.closest('tr').querySelector('td:nth-child(2)').textContent;
        showConfirmModal(
            'Spieler Bannen',
            `Bist du sicher, dass du ${playerName} bannen möchtest? Das kann nicht rückgängig gemacht werden.`,
            () => showToast(`${playerName} wurde gebannt!`, 'danger')
        );
    });
});

document.querySelectorAll('.teleport').forEach(btn => {
    btn.addEventListener('click', function () {
        const playerName = this.closest('tr').querySelector('td:nth-child(2)').textContent;
        showToast(`${playerName} wurde zur Admin HQ teleportiert`, 'success');
    });
});

document.querySelectorAll('.money').forEach(btn => {
    btn.addEventListener('click', function () {
        const playerName = this.closest('tr').querySelector('td:nth-child(2)').textContent;
        const amount = prompt(`Geld geben zu ${playerName}. Betrag eingeben:`, '1000');
        if (amount) {
            showToast(`$${parseInt(amount).toLocaleString()} an ${playerName} gegeben`, 'success');
        }
    });
});

document.querySelectorAll('.item').forEach(btn => {
    btn.addEventListener('click', function () {
        const playerName = this.closest('tr').querySelector('td:nth-child(2)').textContent;
        const item = prompt(`Gegenstand geben zum ${playerName}. Gegenstandsnamen eingeben:`, 'Weapon_Pistol');
        if (item) {
            showToast(`${item} an ${playerName} gegeben`, 'success');
        }
    });
});

// ==================== SERVER CONTROL ====================

function broadcastMessage() {
    const message = document.getElementById('broadcastMsg').value.trim();
    if (message) {
        showConfirmModal(
            'Rundfunk Senden',
            `Nachricht an alle Spieler senden: "${message}"?`,
            () => {
                document.getElementById('broadcastMsg').value = '';
                showToast('Rundfunk an alle Spieler gesendet!', 'success');
            }
        );
    } else {
        showToast('Bitte gib eine Nachricht ein', 'danger');
    }
}

// ==================== LOG FILTERING ====================

document.querySelectorAll('.log-filter-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.log-filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const filter = this.dataset.filter;
        const logs = document.querySelectorAll('.log-entry');

        logs.forEach(log => {
            if (filter === 'all' || log.classList.contains(filter)) {
                log.style.display = 'flex';
            } else {
                log.style.display = 'none';
            }
        });

        showToast(`Zeige ${filter} Protokolle`, 'info');
    });
});

// ==================== TICKET FILTERING ====================

document.querySelectorAll('.ticket-filter-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.ticket-filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const status = this.dataset.status;
        const tickets = document.querySelectorAll('.ticket-item');

        tickets.forEach(ticket => {
            if (status === 'all' || ticket.classList.contains(status)) {
                ticket.style.display = 'block';
            } else {
                ticket.style.display = 'none';
            }
        });
    });
});

// Open ticket functionality
document.querySelectorAll('.ticket-item .btn-primary').forEach(btn => {
    btn.addEventListener('click', function () {
        const ticketId = this.closest('.ticket-item').querySelector('.ticket-id').textContent;
        showToast(`${ticketId} geöffnet`, 'success');
    });
});

// ==================== FACTION TABS ====================

document.querySelectorAll('.faction-tab').forEach(tab => {
    tab.addEventListener('click', function () {
        const faction = this.dataset.faction;

        document.querySelectorAll('.faction-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');

        document.querySelectorAll('.faction-panel').forEach(panel => panel.classList.remove('active'));
        document.querySelector(`.faction-panel[data-faction="${faction}"]`).classList.add('active');

        showToast(`${this.textContent} Fraktionsdaten geladen`, 'info');
    });
});

// ==================== SEARCH FUNCTIONALITY ====================

document.getElementById('quickSearch').addEventListener('input', function (e) {
    const searchTerm = e.target.value.toLowerCase();
    if (searchTerm.length > 2) {
        showToast(`Nach "${searchTerm}" wird gesucht...`, 'info');
    }
});

document.querySelector('.player-search').addEventListener('input', function (e) {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('.players-table tbody tr');

    rows.forEach(row => {
        const playerName = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
        if (playerName.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
});

// ==================== INVESTIGATION ACTIONS ====================

document.querySelectorAll('.investigation-actions button').forEach(btn => {
    btn.addEventListener('click', function () {
        const card = this.closest('.investigation-card');
        const suspect = card.querySelector('h3').textContent;
        const buttonText = this.textContent.trim();

        if (buttonText === 'Beobachten') {
            showToast(`Beobachte ${suspect}`, 'info');
        } else if (buttonText === 'Beweis Hinzufügen') {
            const evidence = prompt('Beweis eingeben:', '');
            if (evidence) {
                showToast(`Beweis hinzugefügt: ${evidence}`, 'success');
            }
        } else if (buttonText === 'Genehmigung Anfordern') {
            showToast('Genehmigungsanfrage an Richter gesendet', 'info');
        } else if (buttonText === 'Razzia Starten') {
            showConfirmModal(
                'Razzia Starten',
                `Bist du sicher, dass du ${suspect} durchsuchen möchtest?`,
                () => showToast('Razzia eingeleitet!', 'success')
            );
        }
    });
});

// ==================== EVENT CONTROLS ====================

document.querySelectorAll('.event-card button').forEach(btn => {
    btn.addEventListener('click', function () {
        const text = this.textContent.trim();
        const event = this.closest('.event-card').querySelector('h4').textContent;

        if (text === 'Alle Teleportieren') {
            showToast(`Alle Spieler zum ${event} teleportiert`, 'success');
        } else if (text === 'Belohnungen Geben') {
            showToast(`Verteilte Veranstaltungsbelohnungen für ${event}`, 'success');
        } else if (text === 'Event Beenden') {
            showConfirmModal(
                'Event Beenden',
                `Bist du sicher, dass du "${event}" beenden möchtest?`,
                () => showToast(`Event "${event}" beendet`, 'success')
            );
        }
    });
});

// ==================== RESPONSIVE MENU TOGGLE ====================

document.querySelector('.menu-toggle').addEventListener('click', function () {
    document.querySelector('.sidebar').classList.toggle('mobile-open');
});

// Close sidebar when menu item is clicked on mobile
if (window.innerWidth <= 768) {
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function () {
            document.querySelector('.sidebar').classList.remove('mobile-open');
        });
    });
}

// ==================== LOGOUT FUNCTIONALITY ====================

document.querySelectorAll('.logout-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        showConfirmModal(
            'Abmelden',
            'Bist du sicher, dass du dich abmelden möchtest?',
            () => {
                showToast('Melde dich ab...', 'info');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 1000);
            }
        );
    });
});

// ==================== NOTIFICATION BUTTON ====================

document.querySelector('.notification-btn').addEventListener('click', function () {
    showToast('Du hast 3 neue Benachrichtigungen', 'info');
});

// ==================== SETTINGS PAGE ====================

document.querySelectorAll('.settings-card .btn-primary').forEach(btn => {
    btn.addEventListener('click', function () {
        showToast('Einstellungen erfolgreich gespeichert!', 'success');
    });
});

// ==================== ADD ANIMATIONS ON HOVER ====================

document.querySelectorAll('.btn-primary, .btn-danger, .btn-warning, .btn-success').forEach(btn => {
    btn.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-2px)';
    });

    btn.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0)';
    });
});

// ==================== KEYBOARD SHORTCUTS ====================

document.addEventListener('keydown', function (e) {
    // Ctrl/Cmd + K for quick search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('quickSearch').focus();
    }

    // Escape to close modals
    if (e.key === 'Escape') {
        closeModal();
        closePlayerModal();
    }
});

// ==================== DYNAMIC UPDATES ====================

// Simulate real-time updates
setInterval(() => {
    // Update CPU usage
    const cpuElements = document.querySelectorAll('.cpu .progress-fill');
    cpuElements.forEach(el => {
        const newValue = Math.floor(Math.random() * (70 - 30 + 1) + 30);
        el.style.width = newValue + '%';
    });

    // Update RAM usage
    const ramElements = document.querySelectorAll('.ram .progress-fill');
    ramElements.forEach(el => {
        const newValue = Math.floor(Math.random() * (85 - 50 + 1) + 50);
        el.style.width = newValue + '%';
    });
}, 5000);

// Add slideOut animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    .stat-card {
        position: relative;
        z-index: 1;
    }

    .control-select option,
    .filter-select option,
    .event-select option {
        background: var(--bg-primary);
        color: var(--text-primary);
    }
`;
document.head.appendChild(style);

// ==================== TERMINAL SERVER LOGS ==================== 

let isTerminalRunning = true;
let terminalLogCount = 0;

const serverLogExamples = [
    '[INFO] Player connected: {player}',
    '[DEBUG] NPC spawn at coordinates {x}, {y}',
    '[WARNING] High server load detected: {load}%',
    '[ERROR] Database connection timeout',
    '[INFO] Economy sync update: {amount} transactions',
    '[DEBUG] Cache cleared: {size}MB freed',
    '[INFO] Vehicle spawned at location',
    '[WARNING] Memory usage critical: {mem}%',
    '[INFO] Job dispatch to player {player}',
    '[DEBUG] Inventory update completed',
    '[INFO] Admin command executed: {cmd}',
    '[ERROR] Failed to load map data',
    '[INFO] Faction rank updated',
    '[DEBUG] Pathfinding calculation: {time}ms',
    '[WARNING] Player spawn rate exceeding limits',
    '[INFO] Transaction logged: ${amount}',
    '[DEBUG] Texture streaming active',
    '[INFO] Security checkpoint passed',
    '[WARNING] Network lag detected: {ping}ms',
    '[INFO] Daily reset executed',
    '[DEBUG] NPC AI routine update',
    '[ERROR] Socket connection lost to client',
    '[INFO] Police dispatch system active',
    '[WARNING] Disk I/O bottleneck detected',
    '[INFO] New player account created',
    '[ERROR] Segmentation fault at 0x{addr}',
    '[DEBUG] Heap allocation: {heap}MB (fragmentation: {frag}%)',
    '[WARNING] GC pause time exceeded: {gc}ms',
    '[ERROR] MySQL Error {errno}: {msg}',
    '[DEBUG] Query execution time: {time}ms (slow query log)',
    '[INFO] Connection pool active: {conn}/{max} connections',
    '[WARNING] TCP_NODELAY disabled on socket {sock}',
    '[ERROR] ECONNREFUSED 127.0.0.1:{port}',
    '[DEBUG] Thread pool: {active}/{total} threads active',
    '[INFO] Event queue processed {count} events',
    '[WARNING] Buffer overflow detected in {buf}, resized to {size}',
    '[ERROR] Stack trace: {func1} -> {func2} -> {func3}',
    '[DEBUG] Memory mapping: base=0x{base}, size=0x{size}',
    '[INFO] Cryptographic hash verified: SHA256=0x{hash}',
    '[ERROR] SSL/TLS handshake failed: Certificate validation error',
    '[DEBUG] Packet loss detected: {loss}% on route {route}',
    '[WARNING] Response time SLA violated: {time}ms > {limit}ms',
    '[INFO] Load balancer routing to node-{node}',
    '[ERROR] Mutex deadlock detected in {module}',
    '[DEBUG] Cache invalidation cascade: {count} entries affected',
    '[INFO] Compression ratio: {ratio}% (LZ4 codec)',
    '[WARNING] FileDescriptor exhaustion approaching: {used}/{max}',
    '[ERROR] inode allocation failure at superblock {block}',
    '[DEBUG] Virtual memory pressure: {vmpres}% (swapfile: {swap}MB)',
    '[INFO] Circuit breaker tripped for endpoint /api/{endpoint}',
    '[WARNING] Slow log detected - query hash: 0x{hash}',
    '[ERROR] Transaction rollback: constraint violation in table {table}',
    '[DEBUG] Lua script execution: {time}ms (instructions: {instr})',
    '[INFO] Webhook delivered to {url} (retry_count: {retry})',
    '[WARNING] TLS certificate expires in {days} days',
    '[ERROR] Uncaught exception: NullReferenceException at {addr}',
    '[DEBUG] Bloom filter false positive rate: {rate}%',
    '[INFO] Distributed trace ID: {trace}',
    '[WARNING] Backpressure detected: queue depth {queue}/{max}',
    '[ERROR] HashMap collision rate exceeded threshold: {rate}%',
    '[DEBUG] Garbage collection: Full GC completed in {time}ms',
    '[INFO] Rate limiter: {curr}/{limit} requests (window: {window}s)',
    '[WARNING] Clock skew detected: {skew}ms with peer {peer}',
    '[ERROR] FATAL: Out of memory in allocator_pool[{pool}]',
    '[DEBUG] Replication lag: {lag}ms (master-slave sync)',
    '[INFO] Batch operation completed: {count} items in {time}ms',
    '[WARNING] Disk SMART warning: {param} degrading',
    '[ERROR] Kernel panic: Hardware interrupt {irq} unhandled',
    '[DEBUG] Interrupt vector allocated at 0x{vec}',
    '[INFO] Session token refreshed: TTL extended to {ttl}s',
    '[WARNING] Connection reset by peer on {host}:{port}',
    '[ERROR] Segmentation fault: Access violation at 0x{addr}',
    '[DEBUG] Memory barrier acquired: spinlock wait {time}µs',
    '[INFO] Data checkpoint completed: {size}MB flushed to disk',
    '[ERROR] YAML parse error at line {line}: expected token type',
    '[DEBUG] JSON deserialization: {count} objects decoded',
    '[WARNING] Protocol buffer mismatch: version {v1} != {v2}',
    '[ERROR] gRPC connection refused: {code}',
    '[INFO] Docker image layer digestdigest: {digest} cached',
    '[DEBUG] Container PID namespace isolation verified',
    '[WARNING] Kubernetes pod evicted: insufficient {resource}',
    '[ERROR] Etcd consensus lost: {lost}/{total} nodes active',
    '[INFO] Prometheus scrape completed: {metrics} samples',
    '[DEBUG] OpenTelemetry span exported: trace_id={trace}',
    '[WARNING] BGP route flap detected on peer AS{asn}',
    '[ERROR] OSPF hello timeout on interface {iface}',
    '[INFO] BGP convergence time: {time}ms',
    '[DEBUG] Netflow v9 template {tmpl} exported',
    '[WARNING] SNMP trap received: OID {oid} = {value}',
    '[ERROR] radius authentication failed from {ip}',
    '[INFO] Forwarding plane update: {rules} rules installed',
    '[DEBUG] FIB lookup: hit ratio {ratio}%',
    '[WARNING] QoS mark collision detected on {port}',
    '[ERROR] ACL session limit exceeded: {curr}/{max}',
    '[INFO] Firewall state table cleanup: {del} entries purged'
];

function generateLogMessage() {
    const template = serverLogExamples[Math.floor(Math.random() * serverLogExamples.length)];
    let message = template;
    
    // Generic replacements
    message = message.replace('{player}', 'Dev_' + Math.floor(Math.random() * 100));
    message = message.replace('{x}', Math.floor(Math.random() * 127000).toString());
    message = message.replace('{y}', Math.floor(Math.random() * 127000).toString());
    message = message.replace('{load}', Math.floor(Math.random() * 100).toString());
    message = message.replace('{amount}', Math.floor(Math.random() * 100000).toString());
    message = message.replace('{size}', Math.floor(Math.random() * 500).toString());
    message = message.replace('{mem}', Math.floor(Math.random() * 100 + 50).toString());
    message = message.replace('{cmd}', ['ban', 'kick', 'tp', 'give', 'freeze', 'warn', 'jail'][Math.floor(Math.random() * 7)]);
    message = message.replace('{time}', Math.floor(Math.random() * 5000).toString());
    message = message.replace('{ping}', Math.floor(Math.random() * 500 + 100).toString());
    
    // Technical replacements
    message = message.replace('{addr}', '7f' + Math.floor(Math.random() * 0xffffffff).toString(16).padStart(8, '0'));
    message = message.replace('{heap}', (Math.random() * 1024 + 256).toFixed(2));
    message = message.replace('{frag}', Math.floor(Math.random() * 30 + 10).toString());
    message = message.replace('{gc}', Math.floor(Math.random() * 500 + 50).toString());
    message = message.replace('{errno}', Math.floor(Math.random() * 150).toString());
    message = message.replace('{msg}', ['too many connections', 'lost connection', 'query timeout', 'access denied', 'table locked'][Math.floor(Math.random() * 5)]);
    message = message.replace('{conn}', Math.floor(Math.random() * 45 + 5).toString());
    message = message.replace('{max}', '50');
    message = message.replace('{sock}', Math.floor(Math.random() * 10000 + 1000).toString());
    message = message.replace('{port}', Math.floor(Math.random() * 55000 + 10000).toString());
    message = message.replace('{active}', Math.floor(Math.random() * 20 + 5).toString());
    message = message.replace('{total}', '32');
    message = message.replace('{count}', Math.floor(Math.random() * 5000).toString());
    message = message.replace('{buf}', ['stack_frame_' + Math.floor(Math.random() * 100), 'buffer_pool_' + Math.floor(Math.random() * 50), 'event_queue_' + Math.floor(Math.random() * 100)][Math.floor(Math.random() * 3)]);
    message = message.replace('{func1}', ['malloc', 'memcpy', 'dlopen', 'pthread_create', 'mmap'][Math.floor(Math.random() * 5)]);
    message = message.replace('{func2}', ['allocate_memory', 'init_thread', 'setup_connection', 'process_event'][Math.floor(Math.random() * 4)]);
    message = message.replace('{func3}', ['main', 'event_loop', 'server_accept', 'handle_client'][Math.floor(Math.random() * 4)]);
    message = message.replace('{base}', '55' + Math.floor(Math.random() * 0xffffffff).toString(16).padStart(8, '0'));
    message = message.replace('{hash}', Math.floor(Math.random() * 0xffffffff).toString(16).padStart(8, '0').toUpperCase());
    message = message.replace('{loss}', (Math.random() * 5).toFixed(2));
    message = message.replace('{route}', '192.168.' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255));
    message = message.replace('{limit}', Math.floor(Math.random() * 5000 + 1000).toString());
    message = message.replace('{node}', Math.floor(Math.random() * 10 + 1).toString());
    message = message.replace('{module}', ['physics_engine', 'render_system', 'network_io', 'database_layer'][Math.floor(Math.random() * 4)]);
    message = message.replace('{ratio}', (Math.random() * 40 + 40).toFixed(1));
    message = message.replace('{used}', Math.floor(Math.random() * 1000 + 500).toString());
    message = message.replace('{vmpres}', Math.floor(Math.random() * 60 + 20).toString());
    message = message.replace('{swap}', Math.floor(Math.random() * 2048).toString());
    message = message.replace('{endpoint}', ['auth', 'payment', 'inventory', 'faction'][Math.floor(Math.random() * 4)]);
    message = message.replace('{table}', ['players', 'transactions', 'properties', 'vehicles'][Math.floor(Math.random() * 4)]);
    message = message.replace('{instr}', Math.floor(Math.random() * 100000 + 10000).toString());
    message = message.replace('{url}', 'https://webhook.service.' + ['prod', 'staging', 'dev'][Math.floor(Math.random() * 3)] + '.local/hook/xyz123');
    message = message.replace('{days}', Math.floor(Math.random() * 90 + 10).toString());
    message = message.replace('{trace}', 'trace-' + Math.random().toString(36).substring(7));
    message = message.replace('{queue}', Math.floor(Math.random() * 80 + 10).toString());
    message = message.replace('{rate}', (Math.random() * 3 + 0.1).toFixed(2));
    message = message.replace('{window}', Math.floor(Math.random() * 60 + 1).toString());
    message = message.replace('{skew}', (Math.random() * 100 - 50).toFixed(1));
    message = message.replace('{peer}', 'node-' + Math.floor(Math.random() * 10 + 1));
    message = message.replace('{pool}', Math.floor(Math.random() * 32).toString());
    message = message.replace('{lag}', Math.floor(Math.random() * 2000).toString());
    message = message.replace('{param}', ['reallocated_sector_count', 'reported_uncorrectable_errors', 'command_timeout_count'][Math.floor(Math.random() * 3)]);
    message = message.replace('{irq}', Math.floor(Math.random() * 224).toString());
    message = message.replace('{vec}', Math.floor(Math.random() * 256).toString(16).padStart(2, '0'));
    message = message.replace('{ttl}', Math.floor(Math.random() * 86400 + 3600).toString());
    message = message.replace('{host}', '10.0.' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255));
    message = message.replace('{retry}', Math.floor(Math.random() * 3).toString());
    
    // Docker/K8s/Network replacements
    message = message.replace('{line}', Math.floor(Math.random() * 500 + 1).toString());
    message = message.replace('{digest}', 'sha256:' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
    message = message.replace('{resource}', ['memory', 'cpu', 'ephemeral-storage', 'pids'][Math.floor(Math.random() * 4)]);
    message = message.replace('{lost}', Math.floor(Math.random() * 3).toString());
    message = message.replace('{total}', Math.floor(Math.random() * 10 + 3).toString());
    message = message.replace('{metrics}', Math.floor(Math.random() * 50000 + 10000).toString());
    message = message.replace('{code}', ['UNAVAILABLE', 'UNAUTHENTICATED', 'PERMISSION_DENIED', 'INTERNAL', 'UNKNOWN'][Math.floor(Math.random() * 5)]);
    message = message.replace('{iface}', ['eth0', 'eth1', 'lo', 'tun0', 'vlan100', 'bond0'][Math.floor(Math.random() * 6)]);
    message = message.replace('{asn}', Math.floor(Math.random() * 65000 + 1000).toString());
    message = message.replace('{tmpl}', 'tmpl_' + Math.floor(Math.random() * 1000).toString());
    message = message.replace('{oid}', '1.3.6.1.' + Math.floor(Math.random() * 10) + '.' + Math.floor(Math.random() * 10));
    message = message.replace('{value}', [Math.floor(Math.random() * 100), 'true', 'false', Math.floor(Math.random() * 65535)][Math.floor(Math.random() * 4)].toString());
    message = message.replace('{ip}', '192.168.' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255));
    message = message.replace('{rules}', Math.floor(Math.random() * 2000 + 100).toString());
    message = message.replace('{del}', Math.floor(Math.random() * 10000).toString());
    message = message.replace('{curr}', Math.floor(Math.random() * 100 + 50).toString());
    message = message.replace('{v1}', Math.floor(Math.random() * 10 + 1).toString());
    message = message.replace('{v2}', Math.floor(Math.random() * 10 + 1).toString());
    
    return message;
}

function generateStackTrace() {
    const traces = [
        'at Object.<anonymous> (/app/src/server/networking.js:' + Math.floor(Math.random() * 5000) + ':' + Math.floor(Math.random() * 30) + ')\n' +
        '    at Module._load (internal/modules/cjs/loader.js:' + Math.floor(Math.random() * 1400) + ':' + Math.floor(Math.random() * 30) + ')\n' +
        '    at Function.Module._load (internal/modules/cjs/loader.js:' + Math.floor(Math.random() * 1400) + ':' + Math.floor(Math.random() * 30) + ')\n' +
        '    at Module.require (internal/modules/cjs/loader.js:' + Math.floor(Math.random() * 1400) + ':' + Math.floor(Math.random() * 30) + ')',
        
        'Traceback (most recent call last):\n' +
        '  File "/usr/lib/python3.9/asyncio/events.py", line ' + Math.floor(Math.random() * 1800) + '\n' +
        '    in _run\n' +
        '  File "/app/server.py", line ' + Math.floor(Math.random() * 2000) + '\n' +
        '    await handle_client(socket, addr)',
        
        'SIGSEGV (Address boundary error) in thread ' + Math.floor(Math.random() * 256) + ' at 0x' + Math.floor(Math.random() * 0xffffffff).toString(16).padStart(16, '0') + '\n' +
        '[0x' + Math.floor(Math.random() * 0xffffffff).toString(16).padStart(8, '0') + '] [0x' + Math.floor(Math.random() * 0xffffffff).toString(16).padStart(8, '0') + ']\n' +
        '    /lib/x86_64-linux-gnu/libc.so.6',
        
        '[' + Math.floor(Math.random() * 99999) + '] panic: runtime error: index out of range [' + Math.floor(Math.random() * 1000) + '] with length ' + Math.floor(Math.random() * 100) + '\n' +
        'goroutine ' + Math.floor(Math.random() * 500) + ' [running]:\n' +
        'main.handleRequest(...)\n' +
        '\t/server/handlers.go:' + Math.floor(Math.random() * 3000),
        
        'PANIC: unprotected error in call to Lua API (attempt to call a non-callable object)\n' +
        'stack traceback:\n' +
        '\t[C]: in function "call"\n' +
        '\t./script.lua:' + Math.floor(Math.random() * 500 + 1) + ': in main chunk',
        
        'java.lang.NullPointerException\n' +
        '\tat com.example.server.NetworkHandler.onMessage(NetworkHandler.java:' + Math.floor(Math.random() * 500) + ')\n' +
        '\tat io.netty.channel.AbstractChannelHandlerContext.invokeChannelRead(AbstractChannelHandlerContext.java:379)\n' +
        '\tat io.netty.channel.DefaultChannelPipeline.fireChannelRead(DefaultChannelPipeline.java:975)',
        
        'FATAL ERROR: TypeError: Cannot read property "id" of undefined\n' +
        '  at PlayerManager.getPlayer (/app/server/managers/PlayerManager.ts:' + Math.floor(Math.random() * 300) + ':' + Math.floor(Math.random() * 20) + ')\n' +
        '  at async GameServer.onPlayerAction (/app/server/GameServer.ts:' + Math.floor(Math.random() * 500) + ':' + Math.floor(Math.random() * 20) + ')',
        
        'MemoryError: unable to allocate ' + Math.floor(Math.random() * 1024 * 1024) + ' bytes\n' +
        'File "/app/dataprocessor.py", line ' + Math.floor(Math.random() * 2000) + ', in process_batch\n' +
        '    result = self.parser.parse(data)\n' +
        'File "/app/parser.py", line ' + Math.floor(Math.random() * 500) + ', in parse',
        
        'Error: ENOENT: no such file or directory, open \'/data/cache/' + Math.random().toString(36).substring(7) + '.json\'\n' +
        '    Code: ENOENT\n' +
        '    errno: -2\n' +
        '    syscall: open\n' +
        '    path: /data/cache/xyz123.json',
        
        'Fatal error: exception End_of_file\n' +
        'Raised by primitive operation at file "caml_parser.c", line ' + Math.floor(Math.random() * 5000) + '\n' +
        'Called from file "src/parser.ml", line ' + Math.floor(Math.random() * 2000),
        
        'ERROR: Memory mapping failed: Cannot allocate memory\n' +
        '    In component: block_device_manager\n' +
        '    Error code: 0x' + Math.floor(Math.random() * 0xffffffff).toString(16).padStart(8, '0').toUpperCase() + '\n' +
        '    Context: /sys/block/sda/stat'
    ];
    
    return traces[Math.floor(Math.random() * traces.length)];
}

function getLogType(message) {
    if (message.includes('[ERROR]')) return 'error';
    if (message.includes('[WARNING]')) return 'warning';
    if (message.includes('[DEBUG]')) return 'secondary';
    if (message.includes('[SUCCESS]')) return 'success';
    return 'info';
}

function getTimestamp() {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
}

function addTerminalLog() {
    if (!isTerminalRunning) return;

    const terminalOutput = document.getElementById('terminalOutput');
    const timestamp = getTimestamp();
    
    // 10% chance of showing a stack trace
    if (Math.random() < 0.1) {
        const stackTrace = generateStackTrace();
        const lines = stackTrace.split('\n');
        
        lines.forEach((line, index) => {
            const logLine = document.createElement('div');
            logLine.className = 'log-line error';
            if (index === 0) {
                logLine.innerHTML = `<span class="log-timestamp">${timestamp}</span>${line}`;
            } else {
                logLine.innerHTML = `<span class="log-timestamp">        </span>${line}`;
            }
            terminalOutput.appendChild(logLine);
            terminalLogCount++;
        });
    } else {
        const message = generateLogMessage();
        const logType = getLogType(message);
        
        const logLine = document.createElement('div');
        logLine.className = `log-line ${logType}`;
        logLine.innerHTML = `<span class="log-timestamp">${timestamp}</span>${message}`;
        
        terminalOutput.appendChild(logLine);
        terminalLogCount++;
    }
    
    // Keep only last 150 logs
    while (terminalLogCount > 150 && terminalOutput.firstChild) {
        terminalOutput.firstChild.remove();
        terminalLogCount--;
    }
    
    // Auto-scroll to bottom
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
    
    // Random speed between 300ms to 3000ms (fast to slow)
    const randomDelay = Math.floor(Math.random() * 2700) + 300;
    setTimeout(addTerminalLog, randomDelay);
}

// Terminal button controls
document.getElementById('clearLogsBtn').addEventListener('click', function() {
    document.getElementById('terminalOutput').innerHTML = '';
    terminalLogCount = 0;
    showToast('Terminal logs gelöscht', 'success');
});

document.getElementById('pauseLogsBtn').addEventListener('click', function() {
    isTerminalRunning = !isTerminalRunning;
    this.textContent = isTerminalRunning ? 'Pause' : 'Resume';
    this.style.background = isTerminalRunning ? 'var(--glass-bg)' : 'rgba(255, 0, 85, 0.2)';
    this.style.borderColor = isTerminalRunning ? 'var(--accent-secondary)' : 'var(--accent-danger)';
    
    if (isTerminalRunning) {
        addTerminalLog();
        showToast('Terminal logs fortgesetzt', 'info');
    } else {
        showToast('Terminal logs pausiert', 'info');
    }
});

// Start terminal logs when page loads
window.addEventListener('load', () => {
    addTerminalLog();
});

console.log('New State RP Admin Panel erfolgreich initialisiert!');
