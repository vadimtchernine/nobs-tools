// noBSdigital GA4 Checker - Landing Page Modal
// Upload this file to GitHub at vadimtchernine/nobs-tools/page1-landing.js

(function() {
  var modalHTML = '<div id="nobs-modal-box" style="background:#f4f7ff;border-radius:14px;width:100%;max-width:680px;max-height:88vh;overflow-y:auto;">'
    + '<div style="background:#1a6ef5;padding:14px 20px;border-radius:14px 14px 0 0;display:flex;align-items:center;justify-content:space-between;gap:10px;">'
    + '<div style="font-size:14px;font-weight:700;color:white;">Example report</div>'
    + '<div style="font-size:11px;font-weight:700;color:#e87e0c;background:rgba(255,255,255,0.15);padding:3px 10px;border-radius:999px;">demo data</div>'
    + '<button onclick="nobsCloseModal()" style="background:rgba(255,255,255,0.2);border:none;color:white;width:28px;height:28px;border-radius:50%;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;font-family:Barlow,sans-serif;flex-shrink:0;">&#x2715;</button>'
    + '</div>'
    + '<div style="padding:22px;">'
    + '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px;flex-wrap:wrap;gap:10px;">'
    + '<div><div style="font-size:11px;font-weight:700;color:#3d5278;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px;">Demo Store, Mar 2026</div><div style="font-size:16px;font-weight:700;color:#0a1628;">GA4 data trust report</div></div>'
    + '<div style="display:inline-flex;background:white;border-radius:999px;padding:3px;border:1px solid rgba(26,110,245,0.2);">'
    + '<button id="nobs-btn-grade" onclick="nobsToggle(\'grade\')" style="font-size:11px;font-weight:700;padding:5px 14px;border-radius:999px;border:none;background:#1a6ef5;color:white;cursor:pointer;font-family:Barlow,sans-serif;">Letter Grade</button>'
    + '<button id="nobs-btn-pct" onclick="nobsToggle(\'pct\')" style="font-size:11px;font-weight:700;padding:5px 14px;border-radius:999px;border:none;background:transparent;color:#3d5278;cursor:pointer;font-family:Barlow,sans-serif;">Percentage</button>'
    + '</div></div>'
    + '<div style="display:flex;gap:8px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">'
    + '<div style="display:flex;align-items:center;gap:4px;font-size:11px;color:#3d5278;font-weight:600;"><div style="width:11px;height:11px;border-radius:50%;background:#c0392b;flex-shrink:0;"></div>F</div>'
    + '<div style="display:flex;align-items:center;gap:4px;font-size:11px;color:#3d5278;font-weight:600;"><div style="width:11px;height:11px;border-radius:50%;background:#e67e22;flex-shrink:0;"></div>D</div>'
    + '<div style="display:flex;align-items:center;gap:4px;font-size:11px;color:#3d5278;font-weight:600;"><div style="width:11px;height:11px;border-radius:50%;background:#f0b429;flex-shrink:0;"></div>C</div>'
    + '<div style="display:flex;align-items:center;gap:4px;font-size:11px;color:#3d5278;font-weight:600;"><div style="width:11px;height:11px;border-radius:50%;background:#27ae60;flex-shrink:0;"></div>B</div>'
    + '<div style="display:flex;align-items:center;gap:4px;font-size:11px;color:#3d5278;font-weight:600;"><div style="width:11px;height:11px;border-radius:50%;background:#1a7a3c;flex-shrink:0;"></div>A</div>'
    + '<div style="font-size:11px;color:#3d5278;margin-left:4px;">grade scale</div>'
    + '</div>'
    + '<div id="nobs-view-grade">'
    + '<div style="display:flex;align-items:center;gap:18px;margin-bottom:18px;">'
    + '<div style="width:86px;height:86px;border-radius:50%;flex-shrink:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#f0b429;">'
    + '<div style="font-size:38px;font-weight:700;color:#0a1628;line-height:1;">C</div>'
    + '<div style="font-size:10px;color:rgba(10,22,40,0.55);margin-top:2px;font-weight:600;">data trust</div>'
    + '</div>'
    + '<div><div style="font-size:15px;font-weight:700;margin-bottom:6px;color:#0a1628;">Needs attention</div>'
    + '<div style="font-size:13px;color:#3d5278;line-height:1.6;">A 78% match rate means roughly 1 in 5 of your Shopify orders is invisible to GA4. Your revenue reporting and ROAS calculations should not be trusted at face value until this is fixed.</div>'
    + '</div></div></div>'
    + '<div id="nobs-view-pct" style="display:none;">'
    + '<div style="margin-bottom:18px;">'
    + '<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px;"><span style="font-size:13px;color:#3d5278;font-weight:600;">Order match rate</span><span style="font-size:38px;font-weight:700;color:#e67e22;">78%</span></div>'
    + '<div style="height:10px;background:rgba(26,110,245,0.1);border-radius:999px;overflow:hidden;margin-bottom:5px;"><div style="height:100%;border-radius:999px;background:#e67e22;width:78%;"></div></div>'
    + '<div style="display:flex;justify-content:space-between;font-size:10px;color:#3d5278;"><span>0%</span><span style="color:#c0392b;">critical &lt;65%</span><span style="color:#e67e22;">review 65-90%</span><span style="color:#27ae60;">healthy &gt;90%</span></div>'
    + '</div></div>'
    + '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:14px;">'
    + '<div style="background:white;border-radius:8px;padding:11px;border:1px solid rgba(26,110,245,0.12);"><div style="font-size:10px;color:#3d5278;margin-bottom:3px;font-weight:600;">Match rate</div><div style="font-size:17px;font-weight:700;color:#e67e22;">78%</div><div style="font-size:10px;color:#3d5278;margin-top:2px;">1,468 of 1,880</div></div>'
    + '<div style="background:white;border-radius:8px;padding:11px;border:1px solid rgba(26,110,245,0.12);"><div style="font-size:10px;color:#3d5278;margin-bottom:3px;font-weight:600;">Missing orders</div><div style="font-size:17px;font-weight:700;color:#c0392b;">412</div><div style="font-size:10px;color:#3d5278;margin-top:2px;">$38k untracked</div></div>'
    + '<div style="background:white;border-radius:8px;padding:11px;border:1px solid rgba(26,110,245,0.12);"><div style="font-size:10px;color:#3d5278;margin-bottom:3px;font-weight:600;">Revenue gap</div><div style="font-size:17px;font-weight:700;color:#e67e22;">18%</div><div style="font-size:10px;color:#3d5278;margin-top:2px;">GA4 under platform</div></div>'
    + '<div style="background:white;border-radius:8px;padding:11px;border:1px solid rgba(26,110,245,0.12);"><div style="font-size:10px;color:#3d5278;margin-bottom:3px;font-weight:600;">Modeling</div><div style="font-size:17px;font-weight:700;color:#27ae60;">off</div><div style="font-size:10px;color:#3d5278;margin-top:2px;">all data observed</div></div>'
    + '</div>'
    + '<div style="display:flex;flex-direction:column;gap:7px;margin-bottom:18px;">'
    + '<div style="border-radius:7px;padding:10px 13px;font-size:12px;display:flex;align-items:flex-start;gap:8px;line-height:1.6;background:#fff0f0;color:#7a1f1f;"><i class="ti ti-alert-circle" style="font-size:14px;margin-top:1px;flex-shrink:0;"></i><span>412 platform orders have no GA4 match. This is a significant tracking gap likely caused by a consent or tag-firing issue, not normal data loss.</span></div>'
    + '<div style="border-radius:7px;padding:10px 13px;font-size:12px;display:flex;align-items:flex-start;gap:8px;line-height:1.6;background:#fff8ed;color:#6b3d00;"><i class="ti ti-receipt" style="font-size:14px;margin-top:1px;flex-shrink:0;"></i><span>18% revenue variance on matched orders. GA4 is likely capturing subtotal only while your platform total includes shipping. Confirm your purchase event configuration.</span></div>'
    + '<div style="border-radius:7px;padding:10px 13px;font-size:12px;display:flex;align-items:flex-start;gap:8px;line-height:1.6;background:#eef4ff;color:#0f3578;"><i class="ti ti-cpu" style="font-size:14px;margin-top:1px;flex-shrink:0;"></i><span>Behavioral modeling is not active. Every transaction in this report is directly observed, so the gaps shown are real, not estimated.</span></div>'
    + '</div>'
    + '<div style="text-align:center;border-top:1px solid rgba(26,110,245,0.1);padding-top:18px;">'
    + '<p style="font-size:13px;color:#3d5278;margin-bottom:14px;line-height:1.5;">This is what your report could look like. Run the check with your own data and find out where you actually stand.</p>'
    + '<a href="/ga4-checker/what-you-need" style="display:inline-block;background:#e87e0c;color:#ffffff;font-size:15px;font-weight:700;padding:13px 28px;border-radius:10px;border:none;cursor:pointer;font-family:Barlow,sans-serif;text-decoration:none;letter-spacing:0.01em;">Check My Data Now</a>'
    + '</div></div></div>';

  var overlay = document.createElement('div');
  overlay.id = 'nobs-modal-overlay';
  overlay.style.cssText = 'display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(10,22,40,0.78);z-index:999999;align-items:center;justify-content:center;padding:20px;font-family:Barlow,sans-serif;';
  overlay.innerHTML = modalHTML;
  document.body.appendChild(overlay);

  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) nobsCloseModal();
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') nobsCloseModal();
  });

  var btn = document.getElementById('nobs-see-example-btn');
  if (btn) {
    btn.addEventListener('click', function() {
      nobsOpenModal();
    });
  }
})();

function nobsOpenModal() {
  var overlay = document.getElementById('nobs-modal-overlay');
  if (overlay) {
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

function nobsCloseModal() {
  var overlay = document.getElementById('nobs-modal-overlay');
  if (overlay) {
    overlay.style.display = 'none';
    document.body.style.overflow = '';
  }
}

function nobsToggle(v) {
  var grade = document.getElementById('nobs-view-grade');
  var pct = document.getElementById('nobs-view-pct');
  var btnGrade = document.getElementById('nobs-btn-grade');
  var btnPct = document.getElementById('nobs-btn-pct');
  if (grade) grade.style.display = v === 'grade' ? 'block' : 'none';
  if (pct) pct.style.display = v === 'pct' ? 'block' : 'none';
  if (btnGrade) { btnGrade.style.background = v === 'grade' ? '#1a6ef5' : 'transparent'; btnGrade.style.color = v === 'grade' ? 'white' : '#3d5278'; }
  if (btnPct) { btnPct.style.background = v === 'pct' ? '#1a6ef5' : 'transparent'; btnPct.style.color = v === 'pct' ? 'white' : '#3d5278'; }
}
