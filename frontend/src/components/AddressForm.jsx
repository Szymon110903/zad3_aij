import React from "react";

function AddressForm({ recipient, errors, onChange }) {
    return (
        <div className="card shadow-lg border-0 h-100">
            <div className="card-header bg-dark text-white py-3">
                <h4 className="mb-0 fs-5">Dane Odbiorcy</h4>
            </div>
            <div className="card-body p-4">
                <form>
                    <h6 className="text-muted text-uppercase small fw-bold mb-3 border-bottom pb-2">Kontakt</h6>
                    
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Imię</label>
                            <input type="text" className={`form-control ${errors.firstname ? 'is-invalid' : ''}`}
                                name="firstname" value={recipient.firstname} onChange={onChange} />
                            {errors.firstname && <div className="invalid-feedback">{errors.firstname}</div>}
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Nazwisko</label>
                            <input type="text" className={`form-control ${errors.lastname ? 'is-invalid' : ''}`}
                                name="lastname" value={recipient.lastname} onChange={onChange} />
                            {errors.lastname && <div className="invalid-feedback">{errors.lastname}</div>}
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Email</label>
                            <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                name="email" value={recipient.email} onChange={onChange} />
                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Telefon</label>
                            <input type="tel" className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                name="phone" value={recipient.phone} onChange={onChange} />
                            {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                        </div>
                    </div>

                    <div className="my-4"></div>

                    <h6 className="text-muted text-uppercase small fw-bold mb-3 border-bottom pb-2">Adres dostawy</h6>

                    <div className="row">
                        <div className="col-md-8 mb-3">
                            <label className="form-label">Ulica</label>
                            <input type="text" className={`form-control ${errors.street ? 'is-invalid' : ''}`}
                                name="street" value={recipient.street} onChange={onChange} placeholder="np. Marszałkowska"/>
                            {errors.street && <div className="invalid-feedback">{errors.street}</div>}
                        </div>
                        <div className="col-md-4 mb-3">
                            <label className="form-label">Nr domu</label>
                            <input type="text" className={`form-control ${errors.number ? 'is-invalid' : ''}`}
                                name="number" value={recipient.number} onChange={onChange} placeholder="np. 10"/>
                            {errors.number && <div className="invalid-feedback">{errors.number}</div>}
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-4 mb-3">
                            <label className="form-label">Kod pocztowy</label>
                            <input type="text" className={`form-control ${errors.postal_number ? 'is-invalid' : ''}`}
                                name="postal_number" value={recipient.postal_number} onChange={onChange} placeholder="00-000"/>
                            {errors.postal_number && <div className="invalid-feedback">{errors.postal_number}</div>}
                        </div>
                        <div className="col-md-8 mb-3">
                            <label className="form-label">Miejscowość</label>
                            <input type="text" className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                                name="city" value={recipient.city} onChange={onChange} placeholder="np. Warszawa"/>
                            {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddressForm;