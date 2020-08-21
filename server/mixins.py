from django.contrib.auth.mixins import UserPassesTestMixin, LoginRequiredMixin
from django.shortcuts import redirect

class UserVerifiedMixin(UserPassesTestMixin, LoginRequiredMixin):

    def handle_no_permission(self):
        return redirect("settings")

    def test_func(self):
        return self.request.user.is_authenticated and self.request.user.is_verified
