import PropTypes from "prop-types";
export default function Modal({
  id,
  title,
  body,
  cancelText,
  confirmText,
  onConfirm,
  showButtons,
  reff,
  size = "md",
}) {
  return (
    <div className="modal fade" id={id} ref={reff} tabIndex={-1}>
      <div className={`modal-dialog modal-dialog-centered modal-${size}`}>
        <div className="modal-content">
          <div className="modal-header  pb-0">
            <h2 className="modal-title overflow-auto fw-bold">
              {title}
            </h2>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          {body && <div className="modal-body">{body}</div>}

          {showButtons && (
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-light"
                data-bs-dismiss="modal"
                onClick={e => e.stopPropagation()}
              >
                {cancelText}
              </button>
              <button
                type="button"
                className="btn btn-danger text-semibold"
                onClick={onConfirm}
                data-bs-dismiss="modal"
              >
                {confirmText}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

Modal.propTypes = {
  body: PropTypes.any,
  cancelText: PropTypes.string,
  confirmText: PropTypes.string,
  id: PropTypes.string,
  onConfirm: PropTypes.func,
  reff: PropTypes.any,
  showButtons: PropTypes.bool,
  size: PropTypes.string,
  title: PropTypes.string,
};
