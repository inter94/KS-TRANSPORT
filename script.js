// Configuration des comptes utilisateurs
const USERS = [
    { username: "admin", password: "admin123", role: "admin" },
    { username: "user", password: "user123", role: "user" }
  ];
  
  // Tarifs des graviers
  const GRAVIER_TYPES = {
    '0/5': 4800,
    '5/15': 7800,
    '5/25': 7500,
    '15/25': 7500
  };
  
  // Tarifs de transport par localité
  const TRANSPORT_FEES = {
    "N'DOUCI": { 'sable': 100000, 'gravier': 85000, 'terre': 40000 },
    "TIASSALE": { 'sable': 100000, 'gravier': 85000, 'terre': 40000 },
    "BATERA": { 'sable': 110000, 'gravier': 95000, 'terre': 45000 },
    "BINAO": { 'sable': 120000, 'gravier': 100000, 'terre': 50000 },
    "BOTENDE": { 'sable': 150000, 'gravier': 130000, 'terre': 60000 },
    "KM101": { 'sable': 150000, 'gravier': 130000, 'terre': 60000 },
    "KM103": { 'sable': 150000, 'gravier': 130000, 'terre': 70000 },
    "KM110": { 'sable': 130000, 'gravier': 110000, 'terre': 70000 },
    "BODO": { 'sable': 120000, 'gravier': 100000, 'terre': 50000 },
    "SIKENSI": { 'sable': 150000, 'gravier': 130000, 'terre': 70000 },
    "KODIMANSO": { 'sable': 120000, 'gravier': 100000, 'terre': 50000 }
  };
  
  // Configuration de sécurité
  const SECURITY_CONFIG = {
    ADMIN_PASSWORD: "KS12345",
    BACKUP_PREFIX: "commandes_backup_"
  };
  
  // Éléments du DOM
  const DOM_ELEMENTS = {
    commandesList: document.getElementById('commandes-list'),
    noCommandes: document.getElementById('no-commandes'),
    filterStatus: document.getElementById('filter-status'),
    filterPayment: document.getElementById('filter-payment'),
    filterDelivery: document.getElementById('filter-delivery'),
    filterDate: document.getElementById('filter-date'),
    filterDateRange: document.getElementById('filter-date-range'),
    filterSearch: document.getElementById('filter-search'),
    filterLocalite: document.getElementById('filter-localite'),
    filterDesignation: document.getElementById('filter-designation'),
    modals: {
      action: document.getElementById('action-modal'),
      status: document.getElementById('status-modal'),
      commande: document.getElementById('commande-modal'),
      refund: document.getElementById('refund-modal'),
      clear: document.getElementById('clear-modal'),
      refundJustification: document.getElementById('refund-justification-modal')
      
    },
    modalTitle: document.getElementById('modal-title'),
    modalBody: document.getElementById('modal-body'),
    confirmAction: document.getElementById('confirm-action'),
    cancelAction: document.getElementById('cancel-action'),
    paymentStatusSelect: document.getElementById('payment-status'),
    deliveryStatusSelect: document.getElementById('delivery-status'),
    saveStatusBtn: document.getElementById('save-status'),
    cancelStatusBtn: document.getElementById('cancel-status'),
    addCommandeBtn: document.getElementById('add-commande'),
    saveCommandeBtn: document.getElementById('save-commande'),
    cancelCommandeBtn: document.getElementById('cancel-commande'),
    addMaterielBtn: document.getElementById('add-materiel'),
    materiauxList: document.getElementById('materiaux-list'),
    exportBtn: document.getElementById('export-data'),
    clearDataBtn: document.getElementById('clear-data'),
    exportPdfBtn: document.getElementById('export-pdf'),
    confirmDeleteInput: document.getElementById('confirm-delete'),
    adminPassword: document.getElementById('admin-password'),
    confirmClearBtn: document.getElementById('confirm-clear'),
    cancelClearBtn: document.getElementById('cancel-clear'),
    refundCommandeInfo: document.getElementById('refund-commande-info'),
    refundAmount: document.getElementById('refund-amount'),
    refundMethod: document.getElementById('refund-method'),
    refundReason: document.getElementById('refund-reason'),
    refundReasonDetails: document.getElementById('refund-reason-details'),
    refundNotes: document.getElementById('refund-notes'),
    refundHistory: document.getElementById('refund-history'),
    refundHistoryList: document.getElementById('refund-history-list'),
    cancelRefundBtn: document.getElementById('cancel-refund'),
    confirmRefundBtn: document.getElementById('confirm-refund'),
    printRefundReceiptBtn: document.getElementById('print-refund-receipt'),
    refundJustificationCommandeInfo: document.getElementById('refund-justification-commande-info'),
    refundJustificationAmount: document.getElementById('refund-justification-amount'),
    refundJustificationMethod: document.getElementById('refund-justification-method'),
    refundJustificationReason: document.getElementById('refund-justification-reason'),
    cancelRefundJustificationBtn: document.getElementById('cancel-refund-justification'),
    confirmRefundJustificationBtn: document.getElementById('confirm-refund-justification'),
    loginScreen: document.getElementById('login-screen'),
    loginButton: document.getElementById('login-button'),
    loginError: document.getElementById('login-error'),
    loginUsername: document.getElementById('login-username'),
    loginPassword: document.getElementById('login-password'),
    logoutButton: document.getElementById('logout-button')
  };
  
  // Variables globales
  let commandes = [];
  let currentAction = null;
  let currentCommandeId = null;
  let currentCommandeIndex = null;
  let isEditing = false;
  
  // Initialisation
  document.addEventListener('DOMContentLoaded', () => {
    try {
      const storedCommandes = localStorage.getItem('commandes');
      commandes = storedCommandes ? JSON.parse(storedCommandes) : [];
    } catch (e) {
      console.error("Erreur lors du chargement des commandes:", e);
      commandes = [];
    }
  
    restorePageState();
    loadCommandes();
    setTodayDate();
    setCurrentTime();
    initEventListeners();
  });
  
  // Fonctions utilitaires
  function formatDate(dateString) {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  }
  
  function setTodayDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('commande-date').value = today;
    DOM_ELEMENTS.filterDate.value = '';
  }
  
  function setCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('commande-heure').value = `${hours}:${minutes}`;
  }
  
  function generateCommandeId() {
    return (commandes.length + 1).toString();
  }
  
  function resetCommandeIds() {
    commandes.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    commandes.forEach((commande, index) => {
      commande.id = (index + 1).toString();
    });
    localStorage.setItem('commandes', JSON.stringify(commandes));
  }
  
  // Fonctions de gestion des commandes
  function loadCommandes() {
    const filters = {
      status: DOM_ELEMENTS.filterStatus.value,
      payment: DOM_ELEMENTS.filterPayment.value,
      delivery: DOM_ELEMENTS.filterDelivery.value,
      date: DOM_ELEMENTS.filterDate.value || null, // Modification ici
      dateRange: DOM_ELEMENTS.filterDateRange.value,
      search: DOM_ELEMENTS.filterSearch.value.toLowerCase(),
      localite: DOM_ELEMENTS.filterLocalite.value,
      designation: DOM_ELEMENTS.filterDesignation.value.toLowerCase()
    };
  
    let filteredCommandes = [...commandes];
    
    // Filtrage
    filteredCommandes = applyFilters(filteredCommandes, filters);
    
    displayCommandes(filteredCommandes);
    updateDecompteur();
    
    // Animation des lignes
    setTimeout(() => {
      const rows = document.querySelectorAll('.commandes-table tr');
      rows.forEach((row, index) => {
        row.style.animationDelay = `${index * 0.1}s`;
      });
    }, 100);
  }
  
  function applyFilters(commandesToFilter, filters) {
    let result = [...commandesToFilter];
    
    // Filtre de statut
    if (filters.status !== 'all') {
      result = result.filter(c => {
        if (filters.status === 'refunded') {
          return c.paymentStatus === 'refunded';
        } else if (filters.status === 'completed') {
          return c.status === 'Terminé' && 
                 c.paymentStatus === 'paid' && 
                 c.deliveryStatus === 'delivered';
        } else {
          return c.status === filters.status;
        }
      });
    }
  
    // Filtre de paiement
    if (filters.payment !== 'all') {
      result = result.filter(c => c.paymentStatus === filters.payment);
    }
  
    // Filtre de livraison
    if (filters.delivery !== 'all') {
      result = result.filter(c => c.deliveryStatus === filters.delivery);
    }
  
    // Filtre par date exacte - seulement si une date est spécifiée
    if (filters.date) { // Modification ici
      result = result.filter(c => c.date === filters.date);
  }
  
    // Filtre par période
    if (filters.dateRange !== 'all') {
      result = filterByDateRange(result, filters.dateRange);
    }
  
    // Filtre de recherche
    if (filters.search) {
      result = result.filter(c => 
        c.client.toLowerCase().includes(filters.search) ||
        c.id.toString().includes(filters.search) ||
        c.telephone.includes(filters.search)
      );
    }
  
    // Filtre par localité
    if (filters.localite !== 'all') {
      result = result.filter(c => c.localite === filters.localite);
    }
  
    // Filtre par désignation
    if (filters.designation) {
      result = result.filter(c =>
        c.items.some(item => item.name.toLowerCase().includes(filters.designation))
      );
    }
  
    return result;
  }
  
  function filterByDateRange(commandesToFilter, range) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normaliser à minuit
    
    // Convertir toutes les dates de commande en objets Date une seule fois
    const commandesWithDates = commandesToFilter.map(c => ({
        ...c,
        dateObj: new Date(c.date)
    }));
    
    switch(range) {
        case 'today':
            const todayStr = today.toISOString().split('T')[0];
            return commandesToFilter.filter(c => c.date === todayStr);
            
        case 'yesterday':
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];
            return commandesToFilter.filter(c => c.date === yesterdayStr);
            
        case 'this-week':
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)); // Lundi de cette semaine
            startOfWeek.setHours(0, 0, 0, 0);
            
            return commandesWithDates
                .filter(c => c.dateObj >= startOfWeek && c.dateObj <= today)
                .map(c => ({ ...c, dateObj: undefined })); // Nettoyer l'objet temporaire
            
        case 'this-month':
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            
            return commandesWithDates
                .filter(c => 
                    c.dateObj.getMonth() === today.getMonth() && 
                    c.dateObj.getFullYear() === today.getFullYear()
                )
                .map(c => ({ ...c, dateObj: undefined }));
                
        case 'last-month':
            const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
            
            return commandesWithDates
                .filter(c => c.dateObj >= lastMonthStart && c.dateObj <= lastMonthEnd)
                .map(c => ({ ...c, dateObj: undefined }));
                
        default:
            return commandesToFilter;
    }
}
  
  function displayCommandes(commandesToDisplay) {
    DOM_ELEMENTS.commandesList.innerHTML = '';
  
    if (commandesToDisplay.length === 0) {
      DOM_ELEMENTS.noCommandes.style.display = 'block';
      return;
    }
  
    DOM_ELEMENTS.noCommandes.style.display = 'none';
  
    commandesToDisplay.forEach((commande, index) => {
      const row = document.createElement('tr');
  
      const statusInfo = getStatusInfo(commande);
      const paymentInfo = getPaymentInfo(commande);
      const deliveryInfo = getDeliveryInfo(commande);
      const restants = getRestantsInfo(commande);
      const actionButtons = getActionButtons(commande.id, index);
        
      row.innerHTML = `
        <td>${commande.id}</td>
        <td>
          <strong>${commande.client}</strong><br>
          <small>${commande.telephone}</small>
        </td>
        <td>${formatDate(commande.date)}</td>
        <td>${commande.heure || 'N/A'}</td>
        <td>${generateDesignation(commande.items)}</td>
        <td>${commande.montant.toLocaleString()} <span class="small-text">FCFA</span></td>
        <td>${commande.reduction.toLocaleString()} <span class="small-text">FCFA</span></td>
        <td>${commande.localite}</td>
        <td><span class="status ${statusInfo.class}">${statusInfo.text}</span></td>
        <td><span class="payment-status ${paymentInfo.class}">${paymentInfo.text}</span></td>
        <td><span class="delivery-status ${deliveryInfo.class}">${deliveryInfo.text}</span></td>
        <td>${restants}</td>
        <td>${actionButtons}</td>
      `;
  
      DOM_ELEMENTS.commandesList.appendChild(row);
    });
  }
  
  function getStatusInfo(commande) {
    let statusClass = '';
    let statusText = '';
    
  
    if (commande.paymentStatus === 'refunded') {
      statusClass = 'status-cancelled';
      statusText = 'Annulé';
    } else {
      switch (commande.status) {
        case 'pending':
          statusClass = 'status-pending';
          statusText = 'En attente';
          break;
        case 'approved':
          statusClass = 'status-approved';
          statusText = 'Validée';
          break;
        case 'cancelled':
          statusClass = 'status-cancelled';
          statusText = 'Annulée';
          break;
        case 'Terminé':
          statusClass = 'status-approved';
          statusText = 'Terminé';
          break;
        default:
          statusClass = 'status-pending';
          statusText = commande.status || 'En attente';
      }
    }

    if (commande.paymentStatus === 'refunded' || commande.paymentStatus === 'partially_refunded') {
        return { 
            class: 'status-cancelled', 
            text: commande.paymentStatus === 'refunded' ? 'Annulé' : 'Partiellement remboursé'
        };
    }
  
    return { class: statusClass, text: statusText };
    
  }
  
  function getPaymentInfo(commande) {
    let paymentClass, paymentText;
    switch (commande.paymentStatus) {
      case 'paid':
        paymentClass = 'payment-paid';
        paymentText = 'Payé';
        break;
      case 'unpaid':
        paymentClass = 'payment-unpaid';
        paymentText = 'Non payé';
        break;
      case 'refunded':
        paymentClass = 'payment-refunded';
        paymentText = 'Remboursé';
        break;
      default:
        paymentClass = 'payment-unpaid';
        paymentText = 'Non payé';
    }
  
    return { class: paymentClass, text: paymentText };
  }
  
  function getDeliveryInfo(commande) {
    const deliveryClass = commande.deliveryStatus === 'delivered' ? 'delivery-delivered' : 'delivery-pending';
    const deliveryText = commande.deliveryStatus === 'delivered' ? 'Livré' : 'Non livré';
    return { class: deliveryClass, text: deliveryText };
  }
  
  function getRestantsInfo(commande) {
    return commande.items.map(item => {
      const totalCommandé = item.qty;
      const totalLivré = item.deliveredQty || 0;
      const restant = totalCommandé - totalLivré;
      return `${restant} x ${item.name}`;
    }).join('<br>');
  }
  
  function getActionButtons(commandeId, index) {
    const commande = commandes[index];
    const isCancelledOrRefunded = commande.status === 'cancelled' || 
                                 commande.paymentStatus === 'refunded' || 
                                 commande.paymentStatus === 'partially_refunded';
    
    return `
      <div class="btn-group">
        <button class="btn btn-primary btn-sm" onclick="showReceipt('${commandeId}')">
          <i class="fas fa-receipt"></i> 
        </button>
        <button class="btn btn-warning btn-sm" onclick="${isCancelledOrRefunded ? 'alert(\"Cette commande ne peut plus être modifiée\");' : `showStatusModal(${index})`}" 
                ${isCancelledOrRefunded ? 'disabled style="opacity:0.5; cursor:not-allowed"' : ''}>
          <i class="fas fa-edit"></i> 
        </button>
        <button class="btn btn-danger btn-sm" onclick="showRefundModal('${commandeId}')" 
                ${commande.status === 'Terminé' || commande.paymentStatus !== 'paid' ? 'disabled style="opacity:0.5; cursor:not-allowed"' : ''}>
          <i class="fas fa-undo"></i> 
        </button>
      </div>
    `;
}
  
  function generateDesignation(items) {
    if (!items) return '';
    
    return items.map(item => {
      if (item.type === 'sable' || item.type === 'terre') {
        return `${item.qty} voyage(s) de ${item.name}`;
      } else if (item.type === 'gravier') {
        const typeText = item.gravelType ? ` (${item.gravelType})` : '';
        return `${item.qty} tonne(s) de ${item.name}${typeText}`;
      } else {
        return `${item.qty} x ${item.name}`;
      }
    }).join('<br>');
  }
  
  // Gestion des modals
  function showModal(modalType, options = {}) {
    const modal = DOM_ELEMENTS.modals[modalType];
    if (!modal) return;
  
    if (options.title) {
      DOM_ELEMENTS.modalTitle.textContent = options.title;
    }
  
    if (options.content) {
      DOM_ELEMENTS.modalBody.innerHTML = options.content;
    }
  
    modal.style.display = 'flex';
  }
  
  function hideModal() {
    Object.values(DOM_ELEMENTS.modals).forEach(modal => {
      modal.style.display = 'none';
    });
    currentAction = null;
    currentCommandeId = null;
    currentCommandeIndex = null;
  }
  
  // Gestion des commandes
  function showCommandeModal() {
    isEditing = false;
    document.getElementById('commande-modal-title').textContent = 'Nouvelle Commande';
    
    // Réinitialisation des champs
    const fields = [
      'commande-client', 'commande-telephone', 'commande-localite',
      'commande-paiement', 'commande-montant', 'commande-reduction'
    ];
    
    fields.forEach(field => {
      document.getElementById(field).value = field === 'commande-reduction' ? '0' : 
                                            field === 'commande-paiement' ? 'Orange Money' : '';
    });
    
    DOM_ELEMENTS.materiauxList.innerHTML = '';
    setTodayDate();
    setCurrentTime();
    
    showModal('commande');
    
    // Animation des champs
    fields.forEach((field, index) => {
      const element = document.getElementById(field);
      element.style.animation = `formFieldSlideIn 0.5s forwards ${index * 0.1}s`;
    });
  }
  
  function saveCommande() {
    const fields = {
      client: document.getElementById('commande-client').value.trim(),
      telephone: document.getElementById('commande-telephone').value.trim(),
      localite: document.getElementById('commande-localite').value,
      date: document.getElementById('commande-date').value,
      heure: document.getElementById('commande-heure').value,
      paiement: document.getElementById('commande-paiement').value,
      montant: parseFloat(document.getElementById('commande-montant').value),
      reduction: parseFloat(document.getElementById('commande-reduction').value) || 0
    };
  
    // Validation
    if (!fields.client || !fields.telephone || !fields.localite || 
        !fields.date || !fields.heure || isNaN(fields.montant) || fields.montant <= 0) {
      alert('Veuillez remplir correctement tous les champs obligatoires (*)');
      return;
    }
  
    if (!TRANSPORT_FEES[fields.localite]) {
      alert("Localité non reconnue. Veuillez sélectionner une localité valide.");
      return;
    }
  
    // Récupération des matériaux
    const items = [];
    let hasErrors = false;
  
    DOM_ELEMENTS.materiauxList.querySelectorAll('.material-item').forEach(item => {
      const type = item.querySelector('.materiel-type').value;
      const qty = parseFloat(item.querySelector('.materiel-qty').value);
      const name = type;
  
      if (!type || isNaN(qty) || qty <= 0) {
        hasErrors = true;
        return;
      }
  
      let gravelType, price, transportFee;
  
      if (type === 'gravier') {
        gravelType = item.querySelector('.gravier-type').value;
        price = GRAVIER_TYPES[gravelType] || 0;
        transportFee = TRANSPORT_FEES[fields.localite]?.gravier || 0;
  
        if (!gravelType || price <= 0) {
          hasErrors = true;
          return;
        }
      } else {
        price = TRANSPORT_FEES[fields.localite]?.[type] || 0;
        transportFee = 0;
      }
  
      items.push({
        name,
        qty,
        type,
        gravelType: type === 'gravier' ? gravelType : undefined,
        pricePerUnit: type === 'gravier' ? price : price,
        transportFee,
        totalPrice: type === 'gravier' ? (price * qty + transportFee) : (price * qty),
        deliveredQty: 0
      });
    });
  
    if (hasErrors || items.length === 0) {
      alert("Veuillez vérifier les matériaux saisis. Chaque matériau doit avoir une quantité valide.");
      return;
    }
  
    // Création de la commande
    const newCommande = {
      id: generateCommandeId(),
      ...fields,
      items,
      status: 'pending',
      paymentStatus: 'unpaid',
      deliveryStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      refundHistory: []
    };
  
    // Sauvegarde
    commandes.unshift(newCommande);
    localStorage.setItem('commandes', JSON.stringify(commandes));
    
    loadCommandes();
    alert(`Commande ${newCommande.id} enregistrée avec succès!\nClient: ${fields.client}\nMontant: ${fields.montant.toLocaleString()} FCFA`);
    
    hideModal();
  }
  
  function addMaterielField() {
    const div = document.createElement('div');
    div.className = 'material-item';
    div.innerHTML = `
      <div class="material-row">
        <div>
          <label>Type *</label>
          <select class="materiel-type" required>
            <option value="">-- Choisir --</option>
            <option value="sable">Sable</option>
            <option value="gravier">Gravier</option>
            <option value="terre">Terre</option>
          </select>
        </div>
        <div>
          <label>Quantité *</label>
          <input type="number" class="materiel-qty" min="1" value="1" required>
        </div>
        <div class="gravier-details" style="display:none">
          <label>Type gravier</label>
          <select class="gravier-type">
            ${Object.keys(GRAVIER_TYPES).map(type => 
              `<option value="${type}">${type}</option>`
            ).join('')}
          </select>
        </div>
      </div>
      <button class="remove-item" onclick="this.parentElement.remove(); calculateTotal()">
        <i class="fas fa-trash"></i> Supprimer
      </button>
    `;
  
    const typeSelect = div.querySelector('.materiel-type');
    typeSelect.addEventListener('change', function() {
      const gravierDetails = div.querySelector('.gravier-details');
      gravierDetails.style.display = this.value === 'gravier' ? 'block' : 'none';
      calculateTotal();
    });
  
    div.querySelector('.materiel-qty').addEventListener('input', calculateTotal);
    div.querySelector('.gravier-type')?.addEventListener('change', calculateTotal);
  
    DOM_ELEMENTS.materiauxList.appendChild(div);
  }
  
  function calculateTotal() {
    const localite = document.getElementById('commande-localite').value;
    if (!localite || !TRANSPORT_FEES[localite]) return;
  
    let total = 0;
    const items = DOM_ELEMENTS.materiauxList.querySelectorAll('.material-item');
  
    items.forEach(item => {
      const type = item.querySelector('.materiel-type').value;
      const qty = parseFloat(item.querySelector('.materiel-qty').value) || 0;
  
      if (type === 'gravier') {
        const gravelType = item.querySelector('.gravier-type').value;
        const prixTonne = GRAVIER_TYPES[gravelType] || 0;
        const transport = TRANSPORT_FEES[localite]?.gravier || 0;
        total += (prixTonne * qty) + transport;
      } else {
        total += (TRANSPORT_FEES[localite]?.[type] || 0) * qty;
      }
    });
  
    const reduction = parseFloat(document.getElementById('commande-reduction').value) || 0;
    total = Math.max(0, total - reduction);
  
    document.getElementById('commande-montant').value = total.toFixed(2);
  }
  
  // Gestion des statuts
  function showStatusModal(commandeIndex) {
    const commande = commandes[commandeIndex];
    if (!commande) return;

 // Empêcher la modification si annulée/remboursée
    if (commande.status === 'cancelled' || 
    commande.paymentStatus === 'refunded' || 
    commande.paymentStatus === 'partially_refunded') {
    alert("Cette commande a été annulée/remboursée et ne peut plus être modifiée.");
    return;
}
  
    if (commande.paymentStatus === 'paid' && commande.deliveryStatus === 'delivered') {
      alert("Cette commande est déjà finalisée (payée et livrée). Aucune modification possible.");
      return;
    }
  
    currentCommandeIndex = commandeIndex;
    DOM_ELEMENTS.paymentStatusSelect.value = commande.paymentStatus;
    DOM_ELEMENTS.deliveryStatusSelect.value = commande.deliveryStatus;
    populateDeliveryItems(commandeIndex);
    showModal('status');
  }
  
  function saveStatusChanges() {
    if (currentCommandeIndex === null) return;
  
    const commande = commandes[currentCommandeIndex];
    commande.paymentStatus = DOM_ELEMENTS.paymentStatusSelect.value;
    commande.deliveryStatus = DOM_ELEMENTS.deliveryStatusSelect.value;
  
    const deliveryQtyInputs = document.querySelectorAll('.delivery-qty');
    deliveryQtyInputs.forEach(input => {
      const itemIndex = parseInt(input.getAttribute('data-item-index'), 10);
      const qtyDelivered = parseFloat(input.value) || 0;
  
      if (commande.items[itemIndex]) {
        const item = commande.items[itemIndex];
        const restant = item.qty - (item.deliveredQty || 0);
  
        if (qtyDelivered > restant) {
          alert(`La quantité livrée pour ${item.name} dépasse le restant (${restant}).`);
          return;
        }
  
        // Mettre à jour la quantité livrée
        item.deliveredQty = (item.deliveredQty || 0) + qtyDelivered;
  
        // Mettre à jour le décompteur
        if (item.type === 'sable') {
          updateDecompteurValue('sable-total', -qtyDelivered);
        } else if (item.type === 'terre') {
          updateDecompteurValue('terre-total', -qtyDelivered);
        }
      }
    });
  
    if (commande.paymentStatus === 'paid' && commande.deliveryStatus === 'delivered') {
      commande.status = 'Terminé';
    }
  
    commande.updatedAt = new Date().toISOString();
    localStorage.setItem('commandes', JSON.stringify(commandes));
    loadCommandes();
    updateDecompteur();
    hideModal();
  }
  
  function populateDeliveryItems(commandeIndex) {
    const commande = commandes[commandeIndex];
    const deliveryItemsContainer = document.getElementById('delivery-items');
    deliveryItemsContainer.innerHTML = '';
  
    commande.items.forEach((item, index) => {
      const totalCommandé = item.qty;
      const totalLivré = item.deliveredQty || 0;
      const restant = totalCommandé - totalLivré;
  
      const itemRow = document.createElement('div');
      itemRow.className = 'form-group';
      itemRow.innerHTML = `
        <label>${item.name} (${item.type === 'gravier' ? item.gravelType : ''})</label>
        <input type="number" class="form-control delivery-qty" 
               data-item-index="${index}" 
               max="${restant}" 
               min="0" 
               value="0" 
               placeholder="Quantité livrée (max: ${restant})">
        <small>Restant : ${restant}</small>
      `;
      deliveryItemsContainer.appendChild(itemRow);
    });
  }
  
  // Gestion des remboursements
  function showRefundModal(commandeId, withJustification = false) {
    const commande = commandes.find(c => c.id === commandeId);
    if (!commande) return;
    
    currentCommandeId = commandeId;
    
    const modalType = withJustification ? 'refundJustification' : 'refund';
    const infoElement = withJustification ? 
      DOM_ELEMENTS.refundJustificationCommandeInfo : 
      DOM_ELEMENTS.refundCommandeInfo;
    
    infoElement.innerHTML = `
      <div class="refund-details">
        <h4>Commande ${commande.id}</h4>
        <p>Client: ${commande.client} (${commande.telephone})</p>
        <p>Montant initial: ${commande.montant.toLocaleString()} FCFA</p>
        <p>Date: ${formatDate(commande.date)}</p>
      </div>
    `;
    
    if (withJustification) {
      DOM_ELEMENTS.refundJustificationAmount.value = commande.montant;
    } else {
      DOM_ELEMENTS.refundAmount.value = commande.montant;
      
      if (commande.refundHistory?.length > 0) {
        DOM_ELEMENTS.refundHistory.style.display = 'block';
        DOM_ELEMENTS.refundHistoryList.innerHTML = commande.refundHistory.map(refund => `
          <div class="refund-item">
            <p><strong>${formatDate(refund.date)}</strong> - ${refund.amount.toLocaleString()} FCFA</p>
            <p>Méthode: ${refund.method} - Raison: ${refund.reason}</p>
            ${refund.notes ? `<p>Notes: ${refund.notes}</p>` : ''}
          </div>
        `).join('');
      } else {
        DOM_ELEMENTS.refundHistory.style.display = 'none';
      }
    }
    
    showModal(modalType);
  }
  
  function processRefund() {
    const commandeIndex = commandes.findIndex(c => c.id === currentCommandeId);
    if (commandeIndex === -1) return;

    const commande = commandes[commandeIndex];

         

        // Vérifications de sécurité
        if (commande.status === 'Terminé') {
            alert("Impossible de rembourser une commande terminée.");
            return;
        }
        
        if (commande.paymentStatus !== 'paid') {
            alert("Impossible de rembourser une commande non payée.");
            return;
        }
    
    // Double vérification (au cas où l'utilisateur aurait forcé l'affichage du modal)
    if (commande.status === 'Terminé') {
        alert("Impossible de rembourser une commande terminée.");
        return;
    }
    
    if (commande.paymentStatus !== 'paid') {
        alert("Impossible de rembourser une commande non payée.");
        return;
    }
    
    const amount = parseFloat(DOM_ELEMENTS.refundAmount.value) || 0;
    const method = DOM_ELEMENTS.refundMethod.value;
    const reason = DOM_ELEMENTS.refundReason.value === 'autre' 
      ? DOM_ELEMENTS.refundReasonDetails.value 
      : DOM_ELEMENTS.refundReason.value;
    const date = new Date().toISOString().split('T')[0];

      
        // 1. RETIRER LES QUANTITÉS DU DÉCOMPTEUR
    commande.items.forEach(item => {
        const nonLivre = item.qty - (item.deliveredQty || 0); // Quantité non encore livrée
        if (nonLivre > 0) {
            if (item.type === 'sable') {
                updateDecompteurValue('sable-total', -nonLivre); // Retire du décompteur
            } else if (item.type === 'terre') {
                updateDecompteurValue('terre-total', -nonLivre); // Retire du décompteur
            }
            item.deliveredQty = item.qty; // Marque comme "livré" pour éviter double comptage
        }
    });

    // 2. Mettre à jour le statut
    commande.refundHistory = commande.refundHistory || [];
    commande.refundHistory.push({
        date: new Date().toISOString(),
        amount,
        method: DOM_ELEMENTS.refundMethod.value,
        reason: DOM_ELEMENTS.refundReason.value === 'autre' 
               ? DOM_ELEMENTS.refundReasonOther.value 
               : DOM_ELEMENTS.refundReason.value,
        notes: DOM_ELEMENTS.refundNotes.value
    });

    commande.paymentStatus = amount >= commande.montant ? 'refunded' : 'partially_refunded';
    commande.status = 'cancelled';
    commande.deliveryStatus = 'pending';
    commande.updatedAt = new Date().toISOString();

    // 3. Sauvegarder et actualiser
    localStorage.setItem('commandes', JSON.stringify(commandes));
    loadCommandes();
    updateDecompteur(); // Actualise l'affichage du décompteur
    hideModal();
    
    if (amount <= 0) {
      alert("Le montant du remboursement doit être supérieur à 0");
      return;
    }
    
    if (amount > commandes[commandeIndex].montant) {
      alert("Le montant du remboursement ne peut pas dépasser le montant de la commande");
      return;
    }
    
    commandes[commandeIndex].refundHistory = commandes[commandeIndex].refundHistory || [];
    commandes[commandeIndex].refundHistory.push({
      date,
      amount,
      method,
      reason,
      notes: DOM_ELEMENTS.refundNotes.value
    });
    
    commandes[commandeIndex].paymentStatus = amount >= commandes[commandeIndex].montant 
      ? 'refunded' 
      : 'partially_refunded';
    commandes[commandeIndex].status = 'cancelled';
    commandes[commandeIndex].deliveryStatus = 'pending';
    commandes[commandeIndex].updatedAt = new Date().toISOString();
    
    localStorage.setItem('commandes', JSON.stringify(commandes));
    hideModal();
    loadCommandes();
    
    alert(`Remboursement de ${amount.toLocaleString()} FCFA effectué avec succès !`);


            // 1. Mettre à jour les quantités dans le décompteur avant de changer le statut
    commande.items.forEach(item => {
        if (item.type === 'sable') {
            updateDecompteurValue('sable-total', item.qty - (item.deliveredQty || 0));
        } else if (item.type === 'terre') {
            updateDecompteurValue('terre-total', item.qty - (item.deliveredQty || 0));
        }
    });

    // 2. Mettre à jour le statut de la commande
    commande.refundHistory = commande.refundHistory || [];
    commande.refundHistory.push({
        date: new Date().toISOString(),
        amount,
        method: DOM_ELEMENTS.refundMethod.value,
        reason: DOM_ELEMENTS.refundReason.value === 'autre' 
               ? DOM_ELEMENTS.refundReasonOther.value 
               : DOM_ELEMENTS.refundReason.value,
        notes: DOM_ELEMENTS.refundNotes.value
    });

    commande.paymentStatus = amount >= commande.montant ? 'refunded' : 'partially_refunded';
    commande.status = 'cancelled';
    commande.deliveryStatus = 'pending';
    commande.updatedAt = new Date().toISOString();

    // 3. Sauvegarder et actualiser
    localStorage.setItem('commandes', JSON.stringify(commandes));
    loadCommandes();
    updateDecompteur();
    hideModal();
    
    alert(`Remboursement de ${amount.toLocaleString()} FCFA effectué avec succès !`);
  }
  
  function processRefundWithJustification() {
    const commandeIndex = commandes.findIndex(c => c.id === currentCommandeId);
    if (commandeIndex === -1) return;
  
    const amount = parseFloat(DOM_ELEMENTS.refundJustificationAmount.value) || 0;
    const method = DOM_ELEMENTS.refundJustificationMethod.value;
    const reason = DOM_ELEMENTS.refundJustificationReason.value.trim();
    const date = new Date().toISOString().split('T')[0];
  
    if (amount <= 0) {
      alert("Le montant du remboursement doit être supérieur à 0");
      return;
    }
  
    if (amount > commandes[commandeIndex].montant) {
      alert("Le montant du remboursement ne peut pas dépasser le montant de la commande");
      return;
    }
  
    if (!reason) {
      alert("Veuillez fournir une justification pour le remboursement");
      return;
    }
  
    commandes[commandeIndex].refundHistory = commandes[commandeIndex].refundHistory || [];
    commandes[commandeIndex].refundHistory.push({
      date,
      amount,
      method,
      reason
    });
  
    commandes[commandeIndex].paymentStatus = amount >= commandes[commandeIndex].montant 
      ? 'refunded' 
      : 'partially_refunded';
    commandes[commandeIndex].status = 'cancelled';
    commandes[commandeIndex].deliveryStatus = 'pending';
    commandes[commandeIndex].updatedAt = new Date().toISOString();
  
    localStorage.setItem('commandes', JSON.stringify(commandes));
    hideModal();
    loadCommandes();
  
    alert(`Remboursement de ${amount.toLocaleString()} FCFA effectué avec succès avec justification !`);
  }
  
  // Gestion des reçus
function showReceipt(commandeId) {
    const commande = commandes.find(c => c.id === commandeId);
    if (!commande) return;

    const montantSansReduction = commande.items.reduce((total, item) => total + item.totalPrice, 0);

    const content = `
        <div style="text-align: center; margin-bottom: 20px; border: 0px solid #FFD700; padding: 5px; border-radius: 10px;">
            <img src="ks-transport.png" alt="KS Transport Logo" style="max-width: 150px; margin-bottom: 10px;">
            <h2 style="color: #FFD700; text-shadow: 1px 1px 2px #000;">KS TRANSPORT</h2>
        </div>
        
        <div style="padding: 15px; border-radius: 8px; margin-bottom: 15px; border: 1px solid #B3D9FF;">
            <h3 style="color: #0066CC; margin-top: 0;">Informations de la commande</h3>
            <p><strong>Localité :</strong> ${commande.localite}</p>
            <p><strong>Date:</strong> ${formatDate(commande.date)}</p>
            <p><strong>Heure:</strong> ${commande.heure}</p>
        </div>
        
        <div style="margin-bottom: 20px;">
            <p><strong>N° Commande :</strong> ${commande.id}</p>
            <p><strong>Client :</strong> ${commande.client}</p>
            <p><strong>Téléphone :</strong> ${commande.telephone}</p>
        </div>
        
        <h4 style="padding: 5px; border-radius: 5px;">Détails des Commandes:</h4>
        <ul style="list-style-type: none; padding-left: 0;">
            ${commande.items.map(item => `
                <li style="margin-bottom: 8px; padding: 8px; background-color: #F5F5F5; border-left: 4px solid #FFD700;">
                    ${item.qty} x ${item.name} 
                    ${item.type === 'gravier' ? `(${item.gravelType})` : ''} - 
                    ${item.totalPrice.toLocaleString()} FCFA
                    ${item.transportFee > 0 ? `<br><small style="color: #0066CC;">(dont transport: ${item.transportFee.toLocaleString()} FCFA)</small>` : ''}
                </li>
            `).join('')}
        </ul>
        
        <div style="margin-top: 20px; font-weight: bold;">
            <p>Montant Total (sans réduction) : ${montantSansReduction.toLocaleString()} FCFA</p>
            ${commande.reduction > 0 ? `<p>Réduction : -${commande.reduction.toLocaleString()} FCFA</p>` : ''}
            <p><strong>Montant Net à Payer :</strong> ${commande.montant.toLocaleString()} FCFA</p>
        </div>
        
        <div style="margin-top: 20px; font-size: 0.9em; color: #666;">
            <p><strong>Statut :</strong> <span class="status-${commande.status.toLowerCase()}">${getStatusInfo(commande).text}</span></p>
            <p><strong>Mode de paiement :</strong> ${commande.paiement}</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #0066CC;">
            <p><strong>Merci pour votre confiance !</strong></p>
            <p><strong>Contacts : (+225) 0702080514 / (+225) 0500058889</strong></p>
        </div>
        
        <div id="receipt-buttons" style="text-align: center; margin-top: 20px;">
            <button class="btn btn-primary" onclick="printReceipt()" style="background-color: #FFD700; color: #000; border: none; padding: 8px 20px; font-weight: bold;">
                <i class="fas fa-print"></i> Imprimer
            </button>
        </div>
    `;

    showModal('action', { 
        title: `Reçu Commande ${commandeId}`,
        content 
    });
}
  
  function printReceipt() {
    const receiptButtons = document.getElementById('receipt-buttons');
    if (receiptButtons) receiptButtons.style.display = 'none';
    window.print();
    if (receiptButtons) receiptButtons.style.display = 'block';
  }
  
  function printRefundReceipt() {
    const commande = commandes.find(c => c.id === currentCommandeId);
    if (!commande) return;
  
    const refundAmountValue = parseFloat(DOM_ELEMENTS.refundAmount.value) || 0;
    const refundMethodValue = DOM_ELEMENTS.refundMethod.value;
    const refundReasonValue = DOM_ELEMENTS.refundReason.value === 'autre' ? 
      DOM_ELEMENTS.refundReasonDetails.value : 
      DOM_ELEMENTS.refundReason.value;
  
    const content = `
      <div style="text-align: center; margin-bottom: 20px;">
        <h2>KS TRANSPORT</h2>
        <p><strong>Reçu de Remboursement</strong></p>
      </div>
      <p><strong>N° Commande :</strong> ${commande.id}</p>
      <p><strong>Client :</strong> ${commande.client}</p>
      <p><strong>Téléphone :</strong> ${commande.telephone}</p>
      <p><strong>Date :</strong> ${new Date().toLocaleDateString('fr-FR')}</p>
      <p><strong>Montant remboursé :</strong> ${refundAmountValue.toLocaleString()} FCFA</p>
      <p><strong>Méthode de remboursement :</strong> ${refundMethodValue}</p>
      <p><strong>Raison :</strong> ${refundReasonValue}</p>
      <div style="text-align: center; margin-top: 20px;">
        <button class="btn btn-primary" onclick="window.print()">Imprimer</button>
      </div>
    `;
  
    showModal('action', { 
      title: 'Reçu de Remboursement',
      content 
    });
  }
  
  // Gestion des décompteurs
  function updateDecompteur() {
    let sableTotal = 0;
    let terreTotal = 0;
  
    commandes.forEach(commande => {
      commande.items.forEach(item => {
        if (item.type === 'sable') {
          sableTotal += item.qty - (item.deliveredQty || 0);
        } else if (item.type === 'terre') {
          terreTotal += item.qty - (item.deliveredQty || 0);
        }
      });
    });
  
    document.getElementById('sable-total').textContent = sableTotal;
    document.getElementById('terre-total').textContent = terreTotal;
  }
  
  function updateDecompteurValue(elementId, delta) {
    const element = document.getElementById(elementId);
    const currentValue = parseInt(element.textContent) || 0;
    element.textContent = currentValue + delta;
    element.classList.add('value-updated');
    setTimeout(() => {
      element.classList.remove('value-updated');
    }, 500);
  }
  
  // Gestion de la suppression des données
  function showClearModal() {
    if (commandes.length === 0) {
      alert("Aucune commande à supprimer.");
      return;
    }
    showModal('clear');
    DOM_ELEMENTS.confirmDeleteInput.value = '';
    DOM_ELEMENTS.adminPassword.value = '';
    DOM_ELEMENTS.confirmClearBtn.disabled = true;
  }
  
  function validateClearConditions() {
    const isTextValid = DOM_ELEMENTS.confirmDeleteInput.value.toUpperCase() === 'SUPPRIMER';
    const isPasswordValid = DOM_ELEMENTS.adminPassword.value === SECURITY_CONFIG.ADMIN_PASSWORD;
    DOM_ELEMENTS.confirmClearBtn.disabled = !(isTextValid && isPasswordValid);
    return isTextValid && isPasswordValid;
  }
  
  function clearAllCommandes() {
    if (!validateClearConditions()) {
      alert("Validation échouée. Vérifiez vos entrées.");
      return;
    }
    
    if (!confirm("⚠️ DERNIÈRE CONFIRMATION :\nVoulez-vous vraiment supprimer TOUTES les commandes ?")) {
      return;
    }
    
    try {
      const backup = {
        timestamp: new Date().toISOString(),
        count: commandes.length,
        totalAmount: commandes.reduce((sum, cmd) => sum + cmd.montant, 0),
        data: JSON.parse(JSON.stringify(commandes))
      };
      
      localStorage.setItem(`${SECURITY_CONFIG.BACKUP_PREFIX}${Date.now()}`, JSON.stringify(backup));
      
      commandes = [];
      resetCommandeIds();
      localStorage.setItem('commandes', JSON.stringify(commandes));
      loadCommandes();
      hideModal();
      alert(`✅ ${backup.count} commandes supprimées avec succès.\nUne sauvegarde a été créée.`);
    } catch (error) {
      console.error("Erreur critique lors de la suppression :", error);
      alert("Une erreur grave est survenue. Les données n'ont pas été supprimées.");
    }
  }
  
  // Gestion de l'authentification
  function handleLogin() {
    const username = DOM_ELEMENTS.loginUsername.value.trim();
    const password = DOM_ELEMENTS.loginPassword.value.trim();
  
    const user = USERS.find(u => u.username === username && u.password === password);
  
    if (user) {
      if (user.role === "admin") {
        localStorage.setItem('isLoggedIn', 'true');
        DOM_ELEMENTS.loginScreen.style.display = 'none';
        document.getElementById('main-container').style.display = 'block';
        loadCommandes();
      } else {
        alert("Accès refusé : vous n'êtes pas administrateur.");
      }
    } else {
      DOM_ELEMENTS.loginError.style.display = 'block';
      setTimeout(() => {
        DOM_ELEMENTS.loginError.style.display = 'none';
      }, 3000);
    }
  }
  
  function handleLogout() {
    localStorage.setItem('isLoggedIn', 'false');
    document.getElementById('main-container').style.display = 'none';
    DOM_ELEMENTS.loginScreen.style.display = 'flex';
    DOM_ELEMENTS.loginUsername.value = '';
    DOM_ELEMENTS.loginPassword.value = '';
  }
  
  // Gestion de l'état de la page
  function savePageState() {
    const filters = {
      status: DOM_ELEMENTS.filterStatus.value,
      payment: DOM_ELEMENTS.filterPayment.value,
      delivery: DOM_ELEMENTS.filterDelivery.value,
      date: DOM_ELEMENTS.filterDate.value,
      dateRange: DOM_ELEMENTS.filterDateRange.value,
      search: DOM_ELEMENTS.filterSearch.value,
      localite: DOM_ELEMENTS.filterLocalite.value,
      designation: DOM_ELEMENTS.filterDesignation.value
    };
  
    localStorage.setItem('pageState', JSON.stringify(filters));
  }
  
  function restorePageState() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const savedFilters = JSON.parse(localStorage.getItem('pageState')) || {};
  
    if (isLoggedIn === 'true') {
      DOM_ELEMENTS.loginScreen.style.display = 'none';
      document.getElementById('main-container').style.display = 'block';
  
      DOM_ELEMENTS.filterStatus.value = savedFilters.status || 'all';
      DOM_ELEMENTS.filterPayment.value = savedFilters.payment || 'all';
      DOM_ELEMENTS.filterDelivery.value = savedFilters.delivery || 'all';
      DOM_ELEMENTS.filterDate.value = savedFilters.date || '';
      DOM_ELEMENTS.filterDateRange.value = savedFilters.dateRange || 'all';
      DOM_ELEMENTS.filterSearch.value = savedFilters.search || '';
      DOM_ELEMENTS.filterLocalite.value = savedFilters.localite || 'all';
      DOM_ELEMENTS.filterDesignation.value = savedFilters.designation || '';
  
      loadCommandes();
    } else {
      DOM_ELEMENTS.loginScreen.style.display = 'flex';
      document.getElementById('main-container').style.display = 'none';
    }
  }
  
  // Initialisation des événements
  function initEventListeners() {
    // Filtres
    DOM_ELEMENTS.filterStatus.addEventListener('change', loadCommandes);
    DOM_ELEMENTS.filterPayment.addEventListener('change', loadCommandes);
    DOM_ELEMENTS.filterDelivery.addEventListener('change', loadCommandes);
    DOM_ELEMENTS.filterDate.addEventListener('change', loadCommandes);
    DOM_ELEMENTS.filterDateRange.addEventListener('change', loadCommandes);
    DOM_ELEMENTS.filterSearch.addEventListener('input', loadCommandes);
    DOM_ELEMENTS.filterLocalite.addEventListener('change', loadCommandes);
    DOM_ELEMENTS.filterDesignation.addEventListener('input', loadCommandes);
    
    // Commandes
    DOM_ELEMENTS.addCommandeBtn.addEventListener('click', showCommandeModal);
    DOM_ELEMENTS.saveCommandeBtn.addEventListener('click', saveCommande);
    DOM_ELEMENTS.cancelCommandeBtn.addEventListener('click', hideModal);
    DOM_ELEMENTS.addMaterielBtn.addEventListener('click', addMaterielField);
    document.getElementById('commande-localite').addEventListener('change', calculateTotal);
    document.getElementById('commande-reduction').addEventListener('input', calculateTotal);
    
    // Actions
    DOM_ELEMENTS.confirmAction.addEventListener('click', confirmCurrentAction);
    DOM_ELEMENTS.cancelAction.addEventListener('click', hideModal);
    DOM_ELEMENTS.saveStatusBtn.addEventListener('click', saveStatusChanges);
    DOM_ELEMENTS.cancelStatusBtn.addEventListener('click', hideModal);
    
    // Remboursements
    DOM_ELEMENTS.refundReason.addEventListener('change', function() {
      DOM_ELEMENTS.refundReasonDetails.style.display = this.value === 'autre' ? 'block' : 'none';
    });
    DOM_ELEMENTS.confirmRefundBtn.addEventListener('click', processRefund);
    DOM_ELEMENTS.cancelRefundBtn.addEventListener('click', hideModal);
    DOM_ELEMENTS.printRefundReceiptBtn.addEventListener('click', printRefundReceipt);
    
    // Sécurité
    DOM_ELEMENTS.clearDataBtn.addEventListener('click', showClearModal);
    DOM_ELEMENTS.confirmDeleteInput.addEventListener('input', validateClearConditions);
    DOM_ELEMENTS.adminPassword.addEventListener('input', validateClearConditions);
    DOM_ELEMENTS.confirmClearBtn.addEventListener('click', clearAllCommandes);
    DOM_ELEMENTS.cancelClearBtn.addEventListener('click', hideModal);
    
    // Connexion
    DOM_ELEMENTS.loginButton.addEventListener('click', handleLogin);
    DOM_ELEMENTS.logoutButton.addEventListener('click', handleLogout);
    
    // Fermeture des modals
    document.querySelectorAll('.close-modal').forEach(btn => {
      btn.addEventListener('click', hideModal);
    });
    
    window.addEventListener('click', (event) => {
      if (Object.values(DOM_ELEMENTS.modals).some(modal => event.target === modal)) {
        hideModal();
      }
    });
  }
  
  function confirmCurrentAction() {
    const commandeIndex = commandes.findIndex(c => c.id === currentCommandeId);
    
    if (commandeIndex !== -1) {
      if (currentAction === 'approve') {
        commandes[commandeIndex].status = 'approved';
      } else {
        commandes[commandeIndex].status = 'cancelled';
        commandes[commandeIndex].paymentStatus = 'unpaid';
        commandes[commandeIndex].deliveryStatus = 'pending';
      }
      
      commandes[commandeIndex].updatedAt = new Date().toISOString();
      localStorage.setItem('commandes', JSON.stringify(commandes));
      loadCommandes();
      hideModal();
      alert(`Commande ${currentAction === 'approve' ? 'validée' : 'annulée'} avec succès !`);
    }
  }
  
  window.addEventListener('beforeunload', savePageState);